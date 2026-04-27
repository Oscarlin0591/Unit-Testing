import Course from '../src/course.js';

describe('Course', () => {
  let course;

  beforeEach(() => {
    course = new Course('CS', 101, 'Intro to Programming', 3);
  });

  describe('constructor', () => {
    test('sets department', () => expect(course.department).toBe('CS'));
    test('sets number', () => expect(course.number).toBe(101));
    test('sets name', () => expect(course.name).toBe('Intro to Programming'));
    test('sets credits', () => expect(course.credits).toBe(3));
  });

  describe('toString', () => {
    test('returns formatted course string', () => {
      expect(course.toString()).toBe('Intro to Programming, CS 101 (3 credits)');
    });
  });
});
