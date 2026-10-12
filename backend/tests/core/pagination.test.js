import { describe, it, expect } from "vitest";
import { parsePagination, paginateQuery } from "../../src/core/utils/pagination.utils.js";

describe("Pagination Utility Unit Tests", () => {
  describe("parsePagination", () => {
    it("should return default values when query is empty", () => {
      const result = parsePagination({});
      expect(result).toEqual({ page: 1, limit: 20, skip: 0 });
    });

    it("should parse string integers for page and limit", () => {
      const result = parsePagination({ page: "3", limit: "15" });
      expect(result).toEqual({ page: 3, limit: 15, skip: 30 });
    });

    it("should clamp invalid or negative page numbers to 1", () => {
      const result = parsePagination({ page: "-5", limit: "10" });
      expect(result.page).toBe(1);
      expect(result.skip).toBe(0);
    });

    it("should clamp limit to maxLimit (default 100)", () => {
      const result = parsePagination({ page: "1", limit: "500" });
      expect(result.limit).toBe(100);
    });

    it("should support custom defaultLimit and maxLimit", () => {
      const result = parsePagination({}, 10, 50);
      expect(result).toEqual({ page: 1, limit: 10, skip: 0 });

      const clamped = parsePagination({ limit: "75" }, 10, 50);
      expect(clamped.limit).toBe(50);
    });
  });

  describe("paginateQuery", () => {
    it("should compute metadata correctly", async () => {
      const mockModel = {
        find: () => ({
          sort: () => ({
            skip: () => ({
              limit: () => {
                const promise = Promise.resolve([{ id: 1 }, { id: 2 }]);
                promise.populate = () => promise;
                promise.select = () => promise;
                return promise;
              },
            }),
          }),
        }),
        countDocuments: () => Promise.resolve(5),
      };

      const result = await paginateQuery(mockModel, {}, { page: 1, limit: 2 });
      expect(result.data).toHaveLength(2);
      expect(result.meta).toEqual({
        page: 1,
        limit: 2,
        total: 5,
        totalPages: 3,
        hasNextPage: true,
        hasPrevPage: false,
      });
    });

    it("should indicate no next page on last page", async () => {
      const mockModel = {
        find: () => ({
          sort: () => ({
            skip: () => ({
              limit: () => {
                const promise = Promise.resolve([{ id: 5 }]);
                promise.populate = () => promise;
                promise.select = () => promise;
                return promise;
              },
            }),
          }),
        }),
        countDocuments: () => Promise.resolve(5),
      };

      const result = await paginateQuery(mockModel, {}, { page: 3, limit: 2 });
      expect(result.meta.page).toBe(3);
      expect(result.meta.totalPages).toBe(3);
      expect(result.meta.hasNextPage).toBe(false);
      expect(result.meta.hasPrevPage).toBe(true);
    });
  });
});
