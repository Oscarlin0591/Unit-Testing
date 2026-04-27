class Person {
  constructor (lastName, firstName, school, dateOfBirth, userName, affiliation) {
    this.lastName = lastName
    this.firstName = firstName
    this.school = school
    this.dateOfBirth = new Date(dateOfBirth)
    this.userName = userName
    this.affiliation = affiliation
  }

  get email () {
    return `${this.userName}@${this.school.domain}`
  }

  toString () {
    return ('\n' + 'Student Name: ' + this.firstName + ' ' + this.lastName + '\n' +
            'School: ' + this.school.name + '\n' +
            'DOB: ' + this.dateOfBirth.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + '\n' +
            'Username: ' + this.userName + '\n' +
            'affiliation: ' + this.affiliation + '\n')
  }
}

module.exports = Person
