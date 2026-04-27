const Person = require('./person.js')

class Instructor extends Person {
  constructor (lastName, firstName, school, dateOfBirth, username) {
    super(lastName, firstName, school, dateOfBirth, username, 'instructor')
    // key = this.course.name
    this.course_list = []
  }

  list_courses (year = null, quarter = null) {
    if (year !== null && quarter !== null) { // filter by year and quarter
      const filtered = this.course_list.filter(course => course.year === year && course.quarter === quarter) // filters
      const sorted = filtered.sort((a, b) => new Date(b.year, b.quarter) - new Date(a.year, a.quarter)) // sorts
      return sorted.map(course => course.toString())
    } else if (year !== null) { // only year arg given
      const filtered = this.course_list.filter(course => course.year === year) // filters
      const sorted = filtered.sort((a, b) => new Date(b.year, b.quarter) - new Date(a.year, a.quarter)) // sorts
      return sorted.map(course => course.toString())
    } else if (quarter !== null) { // only quarter arg given
      const filtered = this.course_list.filter(course => course.quarter === quarter) // filters
      const sorted = filtered.sort((a, b) => new Date(b.year, b.quarter) - new Date(a.year, a.quarter)) // sorts
      return sorted.map(course => course.toString())
    } else { // no filters given, default to None
      const sorted = this.course_list.sort((a, b) => new Date(b.year, b.quarter) - new Date(a.year, a.quarter)) // sorts
      return sorted.map(course => course.toString())
    }
  }

  toString () {
    return ('\n' + 'Instructor Name: ' + this.firstName + ' ' + this.lastName + '\n' +
            'School: ' + this.school.name + '\n' +
            'DOB: ' + this.dateOfBirth.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + '\n' +
            'Username: ' + this.userName + '\n')
  }
}

module.exports = Instructor
