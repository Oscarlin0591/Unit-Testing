import Student from "../src/student.js";
import Course from "../src/course.js";
import CourseOffering from "../src/course-offering.js";

const school = { name: "Test University", domain: "test.edu" };

describe("Student", () => {
  let student;

  beforeEach(() => {
    student = new Student("Johnson", "Bob", school, "2000-03-10", "bjohnson");
  });

  describe("constructor", () => {
    test("sets affiliation to student", () =>
      expect(student.affiliation).toBe("student"));
    test("initializes empty courseList", () =>
      expect(student.courseList).toEqual([]));
    test("initializes empty transcript", () =>
      expect(student.transcript).toEqual({}));
    test("inherits lastName from Person", () =>
      expect(student.lastName).toBe("Johnson"));
    test("inherits email from Person", () =>
      expect(student.email).toBe("bjohnson@test.edu"));
  });

  describe("credits getter", () => {
    test("returns 0 when enrolled in no courses", () => {
      expect(student.credits).toBe(0);
    });

    test("sums credits from all enrolled courses", () => {
      const c1 = new Course("CS", 101, "Intro CS", 3);
      const c2 = new Course("MATH", 201, "Calculus", 4);
      student.courseList.push(new CourseOffering(c1, 1, 2024, "Fall"));
      student.courseList.push(new CourseOffering(c2, 1, 2024, "Fall"));
      expect(student.credits).toBe(7);
    });

    test("counts credits from a single course", () => {
      const course = new Course("CS", 202, "Data Structures", 3);
      student.courseList.push(new CourseOffering(course, 1, 2024, "Spring"));
      expect(student.credits).toBe(3);
    });
  });

  // Cycle 3 RED -> GREEN -> REFACTOR
  describe("gpa getter", () => {
    test("returns 0 when enrolled in no courses", () => {
      expect(student.gpa).toBe(0);
    });

    test("returns 0 when no grades have been submitted", () => {
      const course = new Course("CS", 101, "Intro CS", 3);
      student.courseList.push(new CourseOffering(course, 1, 2024, "Fall"));
      expect(student.gpa).toBe(0);
    });

    test("returns 4.0 for a single A in a 3-credit course", () => {
      const course = new Course("CS", 101, "Intro CS", 3);
      const offering = new CourseOffering(course, 1, 2024, "Fall");
      offering.register_students([student]);
      student.addGrade(offering, "A");
      expect(student.gpa).toBe(4.0);
    });

    test("returns weighted average across multiple courses", () => {
      const c1 = new Course("CS", 101, "Intro CS", 3);
      const c2 = new Course("MATH", 201, "Calculus", 4);
      const o1 = new CourseOffering(c1, 1, 2024, "Fall");
      const o2 = new CourseOffering(c2, 1, 2024, "Fall");
      o1.register_students([student]);
      o2.register_students([student]);
      student.addGrade(o1, "A"); // 4.0 × 3 credits = 12.0
      student.addGrade(o2, "B"); // 3.0 × 4 credits = 12.0
      // total earned = 24.0, total available = 7  → GPA = 24/7 ≈ 3.4286
      expect(student.gpa).toBeCloseTo(24 / 7, 4);
    });

    test("ignores courses where no grade has been recorded", () => {
      const c1 = new Course("CS", 101, "Intro CS", 3);
      const c2 = new Course("MATH", 201, "Calculus", 4);
      const o1 = new CourseOffering(c1, 1, 2024, "Fall");
      const o2 = new CourseOffering(c2, 1, 2024, "Fall");
      o1.register_students([student]);
      o2.register_students([student]);
      student.addGrade(o1, "A"); // only one grade submitted
      expect(student.gpa).toBe(4.0);
    });
  });

  describe("list_courses", () => {
    test("returns empty array when transcript is empty", () => {
      expect(student.list_courses()).toEqual([]);
    });

    test("returns keys present in transcript", () => {
      student.transcript["CS 101 - Fall 2024"] = "A";
      student.transcript["MATH 201 - Fall 2024"] = "B";
      const result = student.list_courses();
      expect(result).toContain("CS 101 - Fall 2024");
      expect(result).toContain("MATH 201 - Fall 2024");
    });

    test("returns an array", () => {
      expect(Array.isArray(student.list_courses())).toBe(true);
    });
  });

  describe("toString", () => {
    test("includes student name", () => {
      const str = student.toString();
      expect(str).toContain("Bob");
      expect(str).toContain("Johnson");
    });
    test("includes email", () => {
      expect(student.toString()).toContain("bjohnson@test.edu");
    });
    test("includes GPA label", () => {
      expect(student.toString()).toContain("GPA:");
    });
    test("includes Credits label", () => {
      expect(student.toString()).toContain("Credits:");
    });
    test("includes school name", () => {
      expect(student.toString()).toContain("Test University");
    });
  });

  // Cycle 1 RED -> GREEN
  describe("addGrade", () => {
    let offering;

    beforeEach(() => {
      const course = new Course("CS", 101, "Intro CS", 3);
      offering = new CourseOffering(course, 1, 2024, "Fall");
      offering.register_students([student]);
    });

    test("stores the grade in the student transcript", () => {
      student.addGrade(offering, "A");
      expect(student.transcript[offering.toString()]).toBe("A");
    });

    test("does not store an invalid grade", () => {
      student.addGrade(offering, "Z");
      expect(student.transcript[offering.toString()]).toBeUndefined();
    });
  });

  // Cycle 2 RED -> GREEN
  describe("getGrade", () => {
    let offering;

    beforeEach(() => {
      const course = new Course("CS", 101, "Intro CS", 3);
      offering = new CourseOffering(course, 1, 2024, "Fall");
      offering.register_students([student]);
    });

    test("returns the grade for a course the student has a grade in", () => {
      student.addGrade(offering, "B+");
      expect(student.getGrade(offering)).toBe("B+");
    });

    test("returns undefined for a course with no grade recorded", () => {
      expect(student.getGrade(offering)).toBeUndefined();
    });
  });
});
