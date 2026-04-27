import Student from '../src/student.js';
import Course from '../src/course.js';
import CourseOffering from '../src/course-offering.js';

const school = { name: 'Test University', domain: 'test.edu' };

describe('Student', () => {
  let student;

  beforeEach(() => {
    student = new Student('Johnson', 'Bob', school, '2000-03-10', 'bjohnson');
  });

  describe('constructor', () => {
    test('sets affiliation to student', () => expect(student.affiliation).toBe('student'));
    test('initializes empty courseList', () => expect(student.courseList).toEqual([]));
    test('initializes empty transcript', () => expect(student.transcript).toEqual({}));
    test('inherits lastName from Person', () => expect(student.lastName).toBe('Johnson'));
    test('inherits email from Person', () => expect(student.email).toBe('bjohnson@test.edu'));
  });

  describe('credits getter', () => {
    test('returns 0 when enrolled in no courses', () => {
      expect(student.credits).toBe(0);
    });

    test('sums credits from all enrolled courses', () => {
      const c1 = new Course('CS', 101, 'Intro CS', 3);
      const c2 = new Course('MATH', 201, 'Calculus', 4);
      student.courseList.push(new CourseOffering(c1, 1, 2024, 'Fall'));
      student.courseList.push(new CourseOffering(c2, 1, 2024, 'Fall'));
      expect(student.credits).toBe(7);
    });

    test('counts credits from a single course', () => {
      const course = new Course('CS', 202, 'Data Structures', 3);
      student.courseList.push(new CourseOffering(course, 1, 2024, 'Spring'));
      expect(student.credits).toBe(3);
    });
  });

  describe('gpa getter', () => {
    test('returns 0 when enrolled in no courses', () => {
      expect(student.gpa).toBe(0);
    });

    test('returns 0 when no grades have been submitted', () => {
      const course = new Course('CS', 101, 'Intro CS', 3);
      student.courseList.push(new CourseOffering(course, 1, 2024, 'Fall'));
      expect(student.gpa).toBe(0);
    });
  });

  describe('list_courses', () => {
    test('returns empty array when transcript is empty', () => {
      expect(student.list_courses()).toEqual([]);
    });

    test('returns keys present in transcript', () => {
      student.transcript['CS 101 - Fall 2024'] = 'A';
      student.transcript['MATH 201 - Fall 2024'] = 'B';
      const result = student.list_courses();
      expect(result).toContain('CS 101 - Fall 2024');
      expect(result).toContain('MATH 201 - Fall 2024');
    });

    test('returns an array', () => {
      expect(Array.isArray(student.list_courses())).toBe(true);
    });
  });

  describe('toString', () => {
    test('includes student name', () => {
      const str = student.toString();
      expect(str).toContain('Bob');
      expect(str).toContain('Johnson');
    });
    test('includes email', () => {
      expect(student.toString()).toContain('bjohnson@test.edu');
    });
    test('includes GPA label', () => {
      expect(student.toString()).toContain('GPA:');
    });
    test('includes Credits label', () => {
      expect(student.toString()).toContain('Credits:');
    });
    test('includes school name', () => {
      expect(student.toString()).toContain('Test University');
    });
  });
});
