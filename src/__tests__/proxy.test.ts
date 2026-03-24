// @vitest-environment node
import { unstable_doesMiddlewareMatch } from "next/experimental/testing/server";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mutable container accessible both in factory and in tests
const authState = vi.hoisted(() => ({ session: null as Record<string, unknown> | null }));

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(
    (callback: (req: NextRequest & { auth: unknown }) => unknown) =>
      (req: NextRequest) =>
        callback(Object.assign(req, { auth: authState.session }))
  ),
}));

import proxyHandler, { config } from "@/proxy";

// Auth.js wraps the handler with a complex overloaded type; cast to the shape
// we actually exercise in tests (one-argument, returns Response or undefined).
const callProxy = proxyHandler as unknown as (
  req: NextRequest
) => Promise<Response | undefined>;

// ── Config matcher ────────────────────────────────────────────────────────────

describe("proxy config matcher", () => {
  function matches(url: string) {
    return unstable_doesMiddlewareMatch({ config, url });
  }

  it("matches /profile", () => {
    expect(matches("http://localhost/profile")).toBe(true);
  });

  it("matches /profile/settings", () => {
    expect(matches("http://localhost/profile/settings")).toBe(true);
  });

  it("matches /characters", () => {
    expect(matches("http://localhost/characters")).toBe(true);
  });

  it("matches /films/1", () => {
    expect(matches("http://localhost/films/1")).toBe(true);
  });

  it("does not match /api routes", () => {
    expect(matches("http://localhost/api/auth/callback/github")).toBe(false);
  });

  it("does not match /_next/static", () => {
    expect(matches("http://localhost/_next/static/chunk.js")).toBe(false);
  });

  it("does not match /_next/image", () => {
    expect(matches("http://localhost/_next/image?url=x")).toBe(false);
  });

  it("does not match favicon.ico", () => {
    expect(matches("http://localhost/favicon.ico")).toBe(false);
  });

  it("does not match .jpg files", () => {
    expect(matches("http://localhost/logo.jpg")).toBe(false);
  });
});

// ── Auth guard ────────────────────────────────────────────────────────────────

describe("proxy auth guard", () => {
  beforeEach(() => {
    authState.session = null;
  });

  it("redirects unauthenticated request to /profile → /", async () => {
    const req = new NextRequest("http://localhost/profile");
    const response = await callProxy(req);
    expect(response?.status).toBe(307);
    expect(response?.headers.get("location")).toBe(
      "http://localhost/sign-in?callbackUrl=%2Fprofile"
    );
  });

  it("passes through authenticated request to /profile", async () => {
    authState.session = { user: { id: "user-1" } };
    const req = new NextRequest("http://localhost/profile");
    const response = await callProxy(req);
    expect(response).toBeUndefined();
  });

  it("passes through unauthenticated request to /characters (not protected)", async () => {
    const req = new NextRequest("http://localhost/characters");
    const response = await callProxy(req);
    expect(response).toBeUndefined();
  });

  it("passes through unauthenticated request to / (not protected)", async () => {
    const req = new NextRequest("http://localhost/");
    const response = await callProxy(req);
    expect(response).toBeUndefined();
  });
});
