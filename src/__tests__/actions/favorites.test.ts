// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockGet = vi.hoisted(() => vi.fn());
const mockInsertValues = vi.hoisted(() => vi.fn().mockResolvedValue(undefined));
const mockDeleteWhere = vi.hoisted(() => vi.fn().mockResolvedValue(undefined));

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/auth", () => ({ auth: vi.fn() }));
vi.mock("@/db", () => ({
  db: {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({ get: mockGet })),
      })),
    })),
    insert: vi.fn(() => ({ values: mockInsertValues })),
    delete: vi.fn(() => ({ where: mockDeleteWhere })),
  },
}));

import { revalidatePath } from "next/cache";

import { toggleFavorite } from "@/actions/favorites";
import { auth } from "@/lib/auth";

const mockedAuth = vi.mocked(auth);
const mockedRevalidatePath = vi.mocked(revalidatePath);

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("toggleFavorite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("auth guard", () => {
    it("throws when session is null", async () => {
      mockedAuth.mockResolvedValue(null as never);
      await expect(toggleFavorite("character", 1)).rejects.toThrow(
        "Not authenticated"
      );
    });

    it("throws when session has no user.id", async () => {
      mockedAuth.mockResolvedValue({ user: {} } as never);
      await expect(toggleFavorite("character", 1)).rejects.toThrow(
        "Not authenticated"
      );
    });
  });

  describe("add favorite (none exists)", () => {
    beforeEach(() => {
      mockedAuth.mockResolvedValue({ user: { id: "user-1" } } as never);
      mockGet.mockResolvedValue(undefined);
    });

    it("returns { favorited: true }", async () => {
      const result = await toggleFavorite("character", 42);
      expect(result).toEqual({ favorited: true });
    });

    it("revalidates /profile", async () => {
      await toggleFavorite("character", 42);
      expect(mockedRevalidatePath).toHaveBeenCalledWith("/profile");
    });

    it("revalidates the entity page", async () => {
      await toggleFavorite("character", 42);
      expect(mockedRevalidatePath).toHaveBeenCalledWith("/characters/42");
    });

    it("revalidates correct path for each entity type", async () => {
      const cases: [Parameters<typeof toggleFavorite>[0], string][] = [
        ["film", "/films/1"],
        ["planet", "/planets/1"],
        ["species", "/species/1"],
        ["starship", "/starships/1"],
        ["vehicle", "/vehicles/1"],
      ];
      for (const [entityType, expectedPath] of cases) {
        vi.clearAllMocks();
        mockGet.mockResolvedValue(undefined);
        await toggleFavorite(entityType, 1);
        expect(mockedRevalidatePath).toHaveBeenCalledWith(expectedPath);
      }
    });
  });

  describe("remove favorite (already exists)", () => {
    beforeEach(() => {
      mockedAuth.mockResolvedValue({ user: { id: "user-1" } } as never);
      mockGet.mockResolvedValue({
        id: 99,
        userId: "user-1",
        entityType: "character",
        entityId: 42,
      });
    });

    it("returns { favorited: false }", async () => {
      const result = await toggleFavorite("character", 42);
      expect(result).toEqual({ favorited: false });
    });

    it("revalidates /profile", async () => {
      await toggleFavorite("character", 42);
      expect(mockedRevalidatePath).toHaveBeenCalledWith("/profile");
    });

    it("revalidates the entity page", async () => {
      await toggleFavorite("character", 42);
      expect(mockedRevalidatePath).toHaveBeenCalledWith("/characters/42");
    });
  });
});
