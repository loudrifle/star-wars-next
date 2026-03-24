// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockGet = vi.hoisted(() => vi.fn());
const mockInsertValues = vi.hoisted(() => vi.fn().mockResolvedValue(undefined));
const mockUpdateSet = vi.hoisted(() =>
  vi.fn(() => ({ where: vi.fn().mockResolvedValue(undefined) }))
);
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
    update: vi.fn(() => ({ set: mockUpdateSet })),
    delete: vi.fn(() => ({ where: mockDeleteWhere })),
  },
}));

import { revalidatePath } from "next/cache";

import { deleteRating, upsertRating } from "@/actions/ratings";
import { auth } from "@/lib/auth";

const mockedAuth = vi.mocked(auth);
const mockedRevalidatePath = vi.mocked(revalidatePath);

// ── upsertRating ──────────────────────────────────────────────────────────────

describe("upsertRating", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("validation", () => {
    it("throws when score < 1", async () => {
      await expect(upsertRating("film", 1, 0)).rejects.toThrow(
        "Score must be between 1 and 5"
      );
    });

    it("throws when score > 5", async () => {
      await expect(upsertRating("film", 1, 6)).rejects.toThrow(
        "Score must be between 1 and 5"
      );
    });
  });

  describe("auth guard", () => {
    it("throws when session is null", async () => {
      mockedAuth.mockResolvedValue(null as never);
      await expect(upsertRating("film", 1, 3)).rejects.toThrow(
        "Not authenticated"
      );
    });

    it("throws when session has no user.id", async () => {
      mockedAuth.mockResolvedValue({ user: {} } as never);
      await expect(upsertRating("film", 1, 3)).rejects.toThrow(
        "Not authenticated"
      );
    });
  });

  describe("insert (no existing rating)", () => {
    beforeEach(() => {
      mockedAuth.mockResolvedValue({ user: { id: "user-1" } } as never);
      mockGet.mockResolvedValue(undefined);
    });

    it("inserts a new rating", async () => {
      await upsertRating("film", 1, 4);
      expect(mockInsertValues).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: "user-1",
          entityType: "film",
          entityId: 1,
          score: 4,
        })
      );
    });

    it("revalidates /profile and entity page", async () => {
      await upsertRating("film", 1, 4);
      expect(mockedRevalidatePath).toHaveBeenCalledWith("/profile");
      expect(mockedRevalidatePath).toHaveBeenCalledWith("/films/1");
    });
  });

  describe("update (existing rating)", () => {
    beforeEach(() => {
      mockedAuth.mockResolvedValue({ user: { id: "user-1" } } as never);
      mockGet.mockResolvedValue({
        id: 10,
        userId: "user-1",
        entityType: "film",
        entityId: 1,
        score: 2,
        review: null,
      });
    });

    it("updates the existing rating score", async () => {
      await upsertRating("film", 1, 5);
      expect(mockUpdateSet).toHaveBeenCalledWith(
        expect.objectContaining({ score: 5 })
      );
    });

    it("revalidates /profile and entity page", async () => {
      await upsertRating("film", 1, 5);
      expect(mockedRevalidatePath).toHaveBeenCalledWith("/profile");
      expect(mockedRevalidatePath).toHaveBeenCalledWith("/films/1");
    });
  });
});

// ── deleteRating ──────────────────────────────────────────────────────────────

describe("deleteRating", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("auth guard", () => {
    it("throws when session is null", async () => {
      mockedAuth.mockResolvedValue(null as never);
      await expect(deleteRating("character", 5)).rejects.toThrow(
        "Not authenticated"
      );
    });

    it("throws when session has no user.id", async () => {
      mockedAuth.mockResolvedValue({ user: {} } as never);
      await expect(deleteRating("character", 5)).rejects.toThrow(
        "Not authenticated"
      );
    });
  });

  describe("delete", () => {
    beforeEach(() => {
      mockedAuth.mockResolvedValue({ user: { id: "user-1" } } as never);
    });

    it("revalidates /profile and entity page", async () => {
      await deleteRating("character", 5);
      expect(mockedRevalidatePath).toHaveBeenCalledWith("/profile");
      expect(mockedRevalidatePath).toHaveBeenCalledWith("/characters/5");
    });
  });
});
