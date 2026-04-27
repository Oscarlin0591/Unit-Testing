const Student = require("./student.js");

class CourseOffering {
  constructor(course, sectionNumber, year, quarter) {
    this.course = course;
    this.sectionNumber = sectionNumber;
    this.instructor = null;
    this.year = year;
    this.quarter = quarter;
    this.registeredStudents = [];
    this.grades = {};
  }

  register_students(students) {
    for (const student of students) {
      this.registeredStudents.push(student);
      student.courseList.push(this);
    }
  }

  get_students() {
    return this.registeredStudents;
  }

  submit_grade(student, grade) {
    const validGrades = [
      "A+",
      "A",
      "A-",
      "B+",
      "B",
      "B-",
      "C+",
      "C",
      "C-",
      "D+",
      "D",
      "D-",
      "F",
    ];
    if (student instanceof Student && validGrades.includes(grade)) {
      this.grades[student.userName] = grade;
      const key = this.toString();
      student.transcript[key] = grade;
    } else {
      return "Please enter a valid grade";
    }
  }

  get_grade(student) {
    if (student instanceof Student) {
      return this.grades[student.userName];
    } else {
      return this.grades[student];
    }
  }

  toString() {
    if (this.instructor) {
      return `${this.course.name}, ${this.course.department} ${this.course.number}-${this.sectionNumber}, ${this.instructor.firstName} ${this.instructor.lastName} (${this.quarter} ${this.year})`;
    } else {
      return `${this.course.name}, ${this.course.department} ${this.course.number}-${this.sectionNumber} (${this.quarter} ${this.year})`;
    }
  }
}

module.exports = CourseOffering;
