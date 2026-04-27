import Person from '../src/person.js';

const school = { name: 'Test University', domain: 'test.edu' };

describe('Person', () => {
  let person;

  beforeEach(() => {
    person = new Person('Doe', 'John', school, '1990-01-15', 'jdoe', 'student');
  });

  describe('constructor', () => {
    test('sets lastName', () => expect(person.lastName).toBe('Doe'));
    test('sets firstName', () => expect(person.firstName).toBe('John'));
    test('sets school', () => expect(person.school).toBe(school));
    test('sets dateOfBirth as a Date object', () => expect(person.dateOfBirth).toBeInstanceOf(Date));
    test('sets userName', () => expect(person.userName).toBe('jdoe'));
    test('sets affiliation', () => expect(person.affiliation).toBe('student'));
  });

  describe('email getter', () => {
    test('returns userName@school.domain', () => {
      expect(person.email).toBe('jdoe@test.edu');
    });
  });

  describe('toString', () => {
    test('includes first and last name', () => {
      const str = person.toString();
      expect(str).toContain('John');
      expect(str).toContain('Doe');
    });
    test('includes school name', () => {
      expect(person.toString()).toContain('Test University');
    });
    test('includes username', () => {
      expect(person.toString()).toContain('jdoe');
    });
    test('includes affiliation', () => {
      expect(person.toString()).toContain('student');
    });
  });
});
