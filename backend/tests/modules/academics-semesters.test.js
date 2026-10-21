import { describe, it, expect, vi, beforeEach } from "vitest";
import { addLessonService } from "../../src/modules/courses/courses.service.js";
import Section from "../../src/models/Section.js";

describe("Courses & Sections Service", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should add and update lessons asynchronously without empty promises", async () => {
    const mockSection = {
      _id: "sec123",
      name: "Chapter 1",
      lessons: [],
      addLesson: vi.fn().mockImplementation(async function (data) {
        this.lessons.push({ _id: "les1", ...data });
        return this;
      }),
    };

    vi.spyOn(Section, "findById").mockResolvedValue(mockSection);

    const updated = await addLessonService("sec123", { name: "Binary Search" });

    expect(mockSection.addLesson).toHaveBeenCalledWith({ name: "Binary Search" });
    expect(updated.lessons.length).toBe(1);
    expect(updated.lessons[0].name).toBe("Binary Search");
  });
});
