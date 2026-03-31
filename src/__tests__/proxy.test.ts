// @vitest-environment node
import { unstable_doesMiddlewareMatch } from "next/experimental/testing/server";
import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import { config, proxy } from "@/proxy";

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

function makeRequest(url: string, cookie?: string) {
  const req = new NextRequest(url);
  if (cookie) {
    req.cookies.set("better-auth.session_token", cookie);
  }
  return req;
}

describe("proxy auth guard", () => {
  it("redirects unauthenticated request to /profile → /sign-in", () => {
    const req = makeRequest("http://localhost/profile");
    const response = proxy(req);
    expect(response?.status).toBe(307);
    expect(response?.headers.get("location")).toBe(
      "http://localhost/sign-in?callbackUrl=%2Fprofile"
    );
  });

  it("passes through authenticated request to /profile", () => {
    const req = makeRequest("http://localhost/profile", "test-session-token");
    const response = proxy(req);
    expect(response).toBeUndefined();
  });

  it("passes through unauthenticated request to /characters (not protected)", () => {
    const req = makeRequest("http://localhost/characters");
    const response = proxy(req);
    expect(response).toBeUndefined();
  });

  it("passes through unauthenticated request to / (not protected)", () => {
    const req = makeRequest("http://localhost/");
    const response = proxy(req);
    expect(response).toBeUndefined();
  });
});
