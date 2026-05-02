const Person = require("./person.js");

const GRADE_SCALE = {
  "A+": 4.0,
  A: 4.0,
  "A-": 3.67,
  "B+": 3.33,
  B: 3.0,
  "B-": 2.67,
  "C+": 2.33,
  C: 2.0,
  "C-": 1.67,
  "D+": 1.33,
  D: 1.0,
  "D-": 0.67,
  F: 0,
};

class Student extends Person {
  constructor(lastName, firstName, school, dateOfBirth, username) {
    super(lastName, firstName, school, dateOfBirth, username, "student");
    this.courseList = [];
    this.transcript = {};
  }
  // Cycle 1 GREEN
  addGrade(offering, grade) {
    if (grade in GRADE_SCALE) {
      this.transcript[offering.toString()] = grade;
    }
  }
  // Cycle 2 GREEN
  getGrade(offering) {
    return this.transcript[offering.toString()];
  }

  list_courses() {
    return Object.keys(this.transcript).sort((a, b) => {
      const yearComparison = b.year - a.year;
      if (yearComparison !== 0) return yearComparison;
      return b.quarter - a.quarter;
    });
  }

  get credits() {
    let total = 0;
    for (const offering of this.courseList) {
      total += offering.course.credits;
    }
    return total;
  }

  get gpa() {
    let earned = 0;
    let available = 0;

    // Cycle 3 GREEN
    for (const offering of this.courseList) {
      const grade = this.transcript[offering.toString()];
      if (grade !== undefined) {
        earned += GRADE_SCALE[grade] * offering.course.credits;
        available += offering.course.credits;
      }
    }

    return available === 0 ? 0 : earned / available;
  }

  toString() {
    return (
      "\n" +
      "Student Name: " +
      this.firstName +
      " " +
      this.lastName +
      "\n" +
      "School: " +
      this.school.name +
      "\n" +
      "DOB: " +
      this.dateOfBirth.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }) +
      "\n" +
      "Username: " +
      this.userName +
      "\n" +
      "Email: " +
      this.email +
      "\n" +
      "GPA: " +
      this.gpa +
      "\n" +
      "Credits: " +
      this.credits +
      "\n"
    );
  }
}

module.exports = Student;
