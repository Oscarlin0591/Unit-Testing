import CourseOffering from '../src/course-offering.js';
import Course from '../src/course.js';
import Student from '../src/student.js';
import Instructor from '../src/instructor.js';

const school = { name: 'Test University', domain: 'test.edu' };

describe('CourseOffering', () => {
  let course, offering, student;

  beforeEach(() => {
    course = new Course('CS', 330, 'Software Engineering', 3);
    offering = new CourseOffering(course, 1, 2024, 'Fall');
    student = new Student('Lee', 'Sam', school, '2001-07-01', 'slee');
  });

  describe('constructor', () => {
    test('sets course', () => expect(offering.course).toBe(course));
    test('sets sectionNumber', () => expect(offering.sectionNumber).toBe(1));
    test('sets year', () => expect(offering.year).toBe(2024));
    test('sets quarter', () => expect(offering.quarter).toBe('Fall'));
    test('instructor defaults to null', () => expect(offering.instructor).toBeNull());
    test('registeredStudents defaults to empty array', () => expect(offering.registeredStudents).toEqual([]));
    test('grades defaults to empty object', () => expect(offering.grades).toEqual({}));
  });

  describe('register_students', () => {
    test('adds student to registeredStudents', () => {
      offering.register_students([student]);
      expect(offering.registeredStudents).toContain(student);
    });

    test('adds this offering to the student courseList', () => {
      offering.register_students([student]);
      expect(student.courseList).toContain(offering);
    });

    test('registers multiple students at once', () => {
      const student2 = new Student('Park', 'Jane', school, '2001-09-15', 'jpark');
      offering.register_students([student, student2]);
      expect(offering.registeredStudents).toHaveLength(2);
    });
  });

  describe('get_students', () => {
    test('returns empty array when no students registered', () => {
      expect(offering.get_students()).toEqual([]);
    });

    test('returns all registered students', () => {
      offering.register_students([student]);
      expect(offering.get_students()).toContain(student);
    });
  });

  describe('submit_grade', () => {
    beforeEach(() => {
      offering.register_students([student]);
    });

    test('records grade in grades keyed by userName', () => {
      offering.submit_grade(student, 'A');
      expect(offering.grades['slee']).toBe('A');
    });

    test('records grade in student transcript', () => {
      offering.submit_grade(student, 'B+');
      expect(student.transcript[offering.toString()]).toBe('B+');
    });

    test('accepts all valid letter grades', () => {
      const validGrades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'];
      validGrades.forEach((grade, i) => {
        const s = new Student('T', 'T', school, '2000-01-01', `u${i}`);
        offering.register_students([s]);
        offering.submit_grade(s, grade);
        expect(offering.grades[s.userName]).toBe(grade);
      });
    });

    test('returns error message for invalid grade', () => {
      expect(offering.submit_grade(student, 'Z')).toBe('Please enter a valid grade');
    });

    test('returns error message when argument is not a Student', () => {
      expect(offering.submit_grade('not-a-student', 'A')).toBe('Please enter a valid grade');
    });
  });

  describe('get_grade', () => {
    beforeEach(() => {
      offering.register_students([student]);
      offering.submit_grade(student, 'A-');
    });

    test('returns grade when passed a Student instance', () => {
      expect(offering.get_grade(student)).toBe('A-');
    });

    test('returns grade when passed a username string', () => {
      expect(offering.get_grade('slee')).toBe('A-');
    });

    test('returns undefined for a student with no grade', () => {
      const other = new Student('X', 'Y', school, '2000-01-01', 'xy');
      expect(offering.get_grade(other)).toBeUndefined();
    });
  });

  describe('toString', () => {
    test('without instructor shows course, section, quarter, and year', () => {
      expect(offering.toString()).toBe('Software Engineering, CS 330-1 (Fall 2024)');
    });

    test('with instructor includes instructor name', () => {
      const instructor = new Instructor('Brown', 'Chris', school, '1975-01-01', 'cbrown');
      offering.instructor = instructor;
      expect(offering.toString()).toBe('Software Engineering, CS 330-1, Chris Brown (Fall 2024)');
    });
  });
});
