import { describe, it, expect } from "vitest";
import {
  calculateThreeMonthsAgo,
  calculateThreeDaysAgo,
  sanitizeSearchQuery,
  getSystemHealthService,
} from "../../src/modules/system/system.service.js";

describe("System & Analytics Service", () => {
  it("should calculate correct 3-month date delta (fixing getDay bug)", () => {
    const fixedDate = new Date("2026-10-15T12:00:00Z");
    const threeMonthsAgo = calculateThreeMonthsAgo(fixedDate);
    expect(threeMonthsAgo.getUTCMonth()).toBe(6); // July is month 6 (0-indexed)
  });

  it("should calculate correct 3-day date delta", () => {
    const fixedDate = new Date("2026-10-15T12:00:00Z");
    const threeDaysAgo = calculateThreeDaysAgo(fixedDate);
    expect(threeDaysAgo.getUTCDate()).toBe(12);
  });

  it("should escape special regex characters to prevent ReDoS injection", () => {
    const maliciousQuery = ".*+?^${}()|[]\\";
    const escaped = sanitizeSearchQuery(maliciousQuery);
    expect(escaped).toBe("\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\");
  });

  it("should return valid system health metrics object", () => {
    const health = getSystemHealthService();
    expect(health.memory).toBeDefined();
    expect(health.cpu).toBeDefined();
    expect(health.memory.length).toBe(2);
    expect(health.cpu.length).toBe(2);
  });
});
