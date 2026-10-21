/**
 * Utility functions for academic letter grades, GPA calculation (4.0 scale),
 * and academic honors standing.
 */

/**
 * Maps numeric percentage score (0-100) to standard 4.0 letter grade and points.
 * @param {number} score
 * @returns {{ letter: string, points: number, passed: boolean }}
 */
export const calculateGradePoint = (score) => {
  const s = Number(score) || 0;
  if (s >= 95) return { letter: "A+", points: 4.0, passed: true };
  if (s >= 90) return { letter: "A", points: 3.75, passed: true };
  if (s >= 85) return { letter: "B+", points: 3.5, passed: true };
  if (s >= 80) return { letter: "B", points: 3.0, passed: true };
  if (s >= 75) return { letter: "C+", points: 2.5, passed: true };
  if (s >= 70) return { letter: "C", points: 2.0, passed: true };
  if (s >= 65) return { letter: "D+", points: 1.5, passed: true };
  if (s >= 60) return { letter: "D", points: 1.0, passed: true };
  return { letter: "F", points: 0.0, passed: false };
};

/**
 * Returns Arabic academic standing based on cumulative GPA.
 * @param {number} gpa
 * @returns {string}
 */
export const getAcademicStanding = (gpa) => {
  const g = Number(gpa) || 0;
  if (g >= 3.5) return "امتياز";
  if (g >= 3.0) return "جيد جداً";
  if (g >= 2.0) return "جيد";
  return "تحت الملاحظة الأكاديمية";
};

/**
 * Calculates quality points earned for a given numeric grade and credit hours.
 * @param {number} numericGrade
 * @param {number} creditHours
 * @returns {{ letter: string, points: number, qualityPoints: number, passed: boolean }}
 */
export const calculateCourseQualityPoints = (numericGrade, creditHours = 3) => {
  const { letter, points, passed } = calculateGradePoint(numericGrade);
  const credits = Number(creditHours) || 3;
  const qualityPoints = Number((points * credits).toFixed(2));
  return {
    letter,
    points,
    qualityPoints,
    passed,
  };
};
