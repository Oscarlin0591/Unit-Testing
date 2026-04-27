class Course {
  constructor (department, number, name, credits) {
    this.department = department
    this.number = number
    this.name = name
    this.credits = credits
  }

  toString () {
    // Example: Algorithms, MPCS 55001, 3 credits
    return `${this.name}, ${this.department} ${this.number} (${this.credits} credits)`
  }
}

module.exports = Course
