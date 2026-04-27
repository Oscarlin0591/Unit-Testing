import { jest } from "@jest/globals";
import Institution from "../src/institution.js";
import Student from "../src/student.js";
import Instructor from "../src/instructor.js";
import Course from "../src/course.js";
import CourseOffering from "../src/course-offering.js";

describe("Institution", () => {
  let institution;

  beforeEach(() => {
    institution = new Institution("Test University", "test.edu");
  });

  describe("constructor", () => {
    test("sets name", () => expect(institution.name).toBe("Test University"));
    test("sets domain", () => expect(institution.domain).toBe("test.edu"));
    test("initializes empty studentList", () =>
      expect(institution.studentList).toEqual({}));
    test("initializes empty courseCatalog", () =>
      expect(institution.courseCatalog).toEqual({}));
    test("initializes empty courseSchedule", () =>
      expect(institution.courseSchedule).toEqual({}));
    test("initializes empty facultyList", () =>
      expect(institution.facultyList).toEqual({}));
  });

  describe("enroll_student", () => {
    let student;

    beforeEach(() => {
      student = new Student("Doe", "Jane", institution, "2002-01-01", "jdoe");
    });

    test("adds student to studentList keyed by userName", () => {
      institution.enroll_student(student);
      expect(institution.studentList["jdoe"]).toBe(student);
    });
  });

  describe("list_students", () => {
    let student1, student2, consoleSpy;

    beforeEach(() => {
      student1 = new Student("Doe", "Jane", institution, "2002-01-01", "j1doe");
      student2 = new Student(
        "Adams",
        "John",
        institution,
        "2000-03-14",
        "j2adams",
      );
      consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    test("logs each enrolled student as 'lastName, firstName'", () => {
      institution.enroll_student(student1);
      institution.enroll_student(student2);
      institution.listStudents();
      const logged = consoleSpy.mock.calls.flat();
      expect(logged).toContain("Doe, Jane");
      expect(logged).toContain("Adams, John");
    });
  });

  describe("hire_instructor", () => {
    let instructor;

    beforeEach(() => {
      instructor = new Instructor(
        "Smith",
        "Bob",
        institution,
        "1980-06-15",
        "bsmith",
      );
    });

    test("adds instructor to facultyList keyed by userName", () => {
      institution.hire_instructor(instructor);
      expect(institution.facultyList["bsmith"]).toBe(instructor);
    });

    test("throws TypeError when argument is not an Instructor", () => {
      expect(() => institution.hire_instructor("not an instructor")).toThrow(
        TypeError,
      );
    });

    test("throws TypeError with descriptive message", () => {
      expect(() => institution.hire_instructor({})).toThrow(
        "Only accepts instructor object",
      );
    });
  });

  describe("add_course", () => {
    let course;

    beforeEach(() => {
      course = new Course("CS", 101, "Intro CS", 3);
    });

    test("adds course to courseCatalog keyed by name", () => {
      institution.add_course(course);
      expect(institution.courseCatalog["Intro CS"]).toBe(course);
    });

    test("returns message when same course is added twice", () => {
      institution.add_course(course);
      expect(institution.add_course(course)).toBe(
        "Course has already been added",
      );
    });
  });

  describe("list_instructors", () => {
    let instructor1, instructor2, consoleSpy;

    beforeEach(() => {
      instructor1 = new Instructor(
        "Smith",
        "Bob",
        institution,
        "1980-06-15",
        "bsmith",
      );
      instructor2 = new Instructor(
        "Jones",
        "Alice",
        institution,
        "1975-03-22",
        "ajones",
      );
      consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    });

    afterEach(() => consoleSpy.mockRestore());

    test("logs each hired instructor as 'lastName, firstName'", () => {
      institution.hire_instructor(instructor1);
      institution.hire_instructor(instructor2);
      institution.list_instructors();
      const logged = consoleSpy.mock.calls.flat();
      expect(logged).toContain("Smith, Bob");
      expect(logged).toContain("Jones, Alice");
    });
  });

  describe("add_course_offering", () => {
    let course, offering;

    beforeEach(() => {
      course = new Course("CS", 101, "Intro CS", 3);
      offering = new CourseOffering(course, 1, 2024, "Fall");
    });

    test("adds offering to courseSchedule when course exists in catalog", () => {
      institution.add_course(course);
      institution.add_course_offering(offering);
      expect(institution.courseSchedule["Intro CS"]).toContain(offering);
    });

    test("appends multiple offerings for the same course", () => {
      institution.add_course(course);
      const offering2 = new CourseOffering(course, 2, 2024, "Fall");
      institution.add_course_offering(offering);
      institution.add_course_offering(offering2);
      expect(institution.courseSchedule["Intro CS"]).toHaveLength(2);
    });
  });

  describe("register_student_for_course", () => {
    let course, offering, student, consoleSpy;

    beforeEach(() => {
      course = new Course("CS", 101, "Intro CS", 3);
      offering = new CourseOffering(course, 1, 2024, "Fall");
      // Source uses offering.registered_students (bug: CourseOffering stores registeredStudents)
      offering.registered_students = [];
      student = new Student("Doe", "Jane", institution, "2002-01-01", "jdoe");
      institution.add_course(course);
      institution.add_course_offering(offering);
      consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    });

    afterEach(() => consoleSpy.mockRestore());

    test("registers student when course parameters and student match", () => {
      // Source checks `student in this.studentList` using object-to-string coercion
      institution.studentList[student] = student;
      institution.register_student_for_course(
        student,
        "Intro CS",
        "CS",
        101,
        1,
        2024,
        "Fall",
      );
      expect(offering.registeredStudents).toContain(student);
    });

    test("logs message when student is already registered in the offering", () => {
      institution.studentList[student] = student;
      offering.registered_students = [student];
      institution.register_student_for_course(
        student,
        "Intro CS",
        "CS",
        101,
        1,
        2024,
        "Fall",
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("is already enrolled in this course"),
      );
    });
  });

  describe("assign_instructor", () => {
    let course, offering, instructor, consoleSpy;

    beforeEach(() => {
      course = new Course("CS", 101, "Intro CS", 3);
      offering = new CourseOffering(course, 1, 2024, "Fall");
      instructor = new Instructor(
        "Smith",
        "Bob",
        institution,
        "1980-06-15",
        "bsmith",
      );
      // Source uses instructor.courseList (bug: Instructor stores course_list)
      instructor.courseList = [];
      institution.add_course(course);
      institution.add_course_offering(offering);
      consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    });

    afterEach(() => consoleSpy.mockRestore());

    test("assigns instructor to a matching offering", () => {
      institution.assign_instructor(
        instructor,
        "Intro CS",
        "CS",
        101,
        1,
        2024,
        "Fall",
      );
      expect(offering.instructor).toBe(instructor);
    });

    test("logs message when instructor is already assigned to the offering", () => {
      offering.instructor = instructor;
      institution.assign_instructor(
        instructor,
        "Intro CS",
        "CS",
        101,
        1,
        2024,
        "Fall",
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("is already teaching this course"),
      );
    });

    test("logs 'course not found' when no offering matches the given parameters", () => {
      institution.assign_instructor(
        instructor,
        "Intro CS",
        "CS",
        101,
        1,
        2025,
        "Spring",
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        "Course not found. Please create a course and course offering",
      );
    });
  });

  describe("list_course_catalog", () => {
    let consoleSpy;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    });

    afterEach(() => consoleSpy.mockRestore());

    test("logs each course in the catalog", () => {
      const course = new Course("CS", 101, "Intro CS", 3);
      institution.add_course(course);
      institution.list_course_catalog();
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe("list_course_schedule", () => {
    let course, consoleSpy;

    beforeEach(() => {
      course = new Course("CS", 101, "Intro CS", 3);
      institution.add_course(course);
      institution.add_course_offering(
        new CourseOffering(course, 1, 2024, "Fall"),
      );
      institution.add_course_offering(
        new CourseOffering(course, 2, 2025, "Spring"),
      );
      consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    });

    afterEach(() => consoleSpy.mockRestore());

    test("lists offerings filtered by dept when matching offerings exist", () => {
      institution.list_course_schedule(2024, "Fall", "CS");
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Intro CS"),
      );
    });

    test("logs no-offerings message when dept filter matches no offerings", () => {
      institution.list_course_schedule(2023, "Winter", "CS");
      expect(consoleSpy).toHaveBeenCalledWith(
        "No offerings during this semester",
      );
    });

    test("lists all offerings when no dept provided and offerings match semester", () => {
      institution.list_course_schedule(2024, "Fall");
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Intro CS"),
      );
    });
  });

  describe("list_registered_students", () => {
    let course, offering, student, consoleSpy;

    beforeEach(() => {
      course = new Course("CS", 101, "Intro CS", 3);
      offering = new CourseOffering(course, 1, 2024, "Fall");
      student = new Student("Doe", "Jane", institution, "2002-01-01", "jdoe");
      // Source iterates offering.registered_students (bug: CourseOffering stores registeredStudents)
      offering.registered_students = [student];
      institution.add_course(course);
      institution.add_course_offering(offering);
      consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    });

    afterEach(() => consoleSpy.mockRestore());

    test("logs registered students for a matching offering", () => {
      institution.list_registered_students(
        "Intro CS",
        "CS",
        101,
        1,
        2024,
        "Fall",
      );
      const logged = consoleSpy.mock.calls.flat();
      expect(logged).toContain("Doe, Jane");
    });
  });
});
