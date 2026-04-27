import Instructor from '../src/instructor.js';
import Course from '../src/course.js';
import CourseOffering from '../src/course-offering.js';

const school = { name: 'Test University', domain: 'test.edu' };

describe('Instructor', () => {
  let instructor;

  beforeEach(() => {
    instructor = new Instructor('Smith', 'Alice', school, '1980-05-20', 'asmith');
  });

  describe('constructor', () => {
    test('sets affiliation to instructor', () => expect(instructor.affiliation).toBe('instructor'));
    test('initializes empty course_list', () => expect(instructor.course_list).toEqual([]));
    test('inherits lastName from Person', () => expect(instructor.lastName).toBe('Smith'));
    test('inherits firstName from Person', () => expect(instructor.firstName).toBe('Alice'));
    test('inherits email from Person', () => expect(instructor.email).toBe('asmith@test.edu'));
  });

  describe('list_courses', () => {
    let offering2024Fall, offering2023Spring;

    beforeEach(() => {
      const course = new Course('CS', 101, 'Intro CS', 3);
      offering2024Fall = new CourseOffering(course, 1, 2024, 'Fall');
      offering2023Spring = new CourseOffering(course, 2, 2023, 'Spring');
      instructor.course_list = [offering2024Fall, offering2023Spring];
    });

    test('returns all courses when no args given', () => {
      expect(instructor.list_courses()).toHaveLength(2);
    });

    test('returns strings for each course', () => {
      instructor.list_courses().forEach(item => expect(typeof item).toBe('string'));
    });

    test('filters by year', () => {
      expect(instructor.list_courses(2024)).toHaveLength(1);
    });

    test('filters by year and quarter', () => {
      expect(instructor.list_courses(2024, 'Fall')).toHaveLength(1);
    });

    test('filters by quarter only', () => {
      expect(instructor.list_courses(null, 'Spring')).toHaveLength(1);
    });

    test('returns empty array when year matches nothing', () => {
      expect(instructor.list_courses(2020)).toHaveLength(0);
    });

    test('returns empty array when quarter matches nothing', () => {
      expect(instructor.list_courses(null, 'Winter')).toHaveLength(0);
    });
  });

  describe('toString', () => {
    test('includes Instructor Name label', () => {
      expect(instructor.toString()).toContain('Instructor Name:');
    });
    test('includes full name', () => {
      expect(instructor.toString()).toContain('Alice Smith');
    });
    test('includes school name', () => {
      expect(instructor.toString()).toContain('Test University');
    });
    test('includes username', () => {
      expect(instructor.toString()).toContain('asmith');
    });
  });
});
