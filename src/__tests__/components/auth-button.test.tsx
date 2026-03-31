import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock("@/actions/auth", () => ({
  serverSignOut: vi.fn(),
}));

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

let mockPathname = "/films/1";
vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

import { serverSignOut } from "@/actions/auth";
import { AuthButton } from "@/components/auth-button";
import type { Session } from "@/lib/auth";

const mockedServerSignOut = vi.mocked(serverSignOut);

// ── Helpers ───────────────────────────────────────────────────────────────────

const SESSION: Session = {
  user: {
    id: "user-1",
    name: "Luke Skywalker",
    email: "luke@jedi.com",
    emailVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  session: {
    id: "sess-1",
    token: "tok",
    expiresAt: new Date(Date.now() + 86400000),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "user-1",
    ipAddress: null,
    userAgent: null,
  },
};

const SESSION_WITH_IMAGE: Session = {
  ...SESSION,
  user: { ...SESSION.user, image: "https://example.com/avatar.jpg" },
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("AuthButton — unauthenticated", () => {
  it("renders a sign-in link with callbackUrl for the current page", () => {
    mockPathname = "/films/1";
    render(<AuthButton session={null} />);
    const link = screen.getByRole("link", { name: /sign in/i });
    expect((link as HTMLAnchorElement).href).toContain(
      "/sign-in?callbackUrl=%2Ffilms%2F1"
    );
  });

  it("renders a sign-in link without callbackUrl when already on /sign-in", () => {
    mockPathname = "/sign-in";
    render(<AuthButton session={null} />);
    const link = screen.getByRole("link", { name: /sign in/i });
    expect((link as HTMLAnchorElement).href).not.toContain("callbackUrl");
  });

  it("does not render a sign-out button", () => {
    render(<AuthButton session={null} />);
    expect(screen.queryByRole("button", { name: /sign out/i })).toBeNull();
  });
});

describe("AuthButton — authenticated", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPathname = "/films/1";
  });

  it("renders the user name", () => {
    render(<AuthButton session={SESSION} />);
    expect(screen.getByText("Luke Skywalker")).toBeDefined();
  });

  it("renders a link to /profile", () => {
    render(<AuthButton session={SESSION} />);
    const link = screen.getByRole("link");
    expect((link as HTMLAnchorElement).href).toContain("/profile");
  });

  it("renders sign-out button", () => {
    render(<AuthButton session={SESSION} />);
    expect(screen.getByRole("button", { name: /sign out/i })).toBeDefined();
  });

  it("calls serverSignOut when sign-out button is clicked", async () => {
    mockedServerSignOut.mockResolvedValue(undefined);
    render(<AuthButton session={SESSION} />);
    await userEvent.click(screen.getByRole("button", { name: /sign out/i }));
    expect(mockedServerSignOut).toHaveBeenCalled();
  });

  it("renders avatar image when user has an image", () => {
    render(<AuthButton session={SESSION_WITH_IMAGE} />);
    const img = screen.getByRole("img");
    expect(img.getAttribute("src")).toBe("https://example.com/avatar.jpg");
    expect(img.getAttribute("alt")).toBe("Luke Skywalker");
  });

  it("does not render sign-in link", () => {
    render(<AuthButton session={SESSION} />);
    expect(screen.queryByRole("link", { name: /sign in/i })).toBeNull();
  });
});
