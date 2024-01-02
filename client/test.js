/* eslint-disable no-restricted-globals */
const StudentData = {
  name: '',
  id: '23233',
  collage: 'Secince Collage',
  career: 'Computer Secince',
  year: 3,
  grades: [
    {
      season: 'الفصل الأول',
      courses: [
        {
          courseName: 'برمجة واجهات',
          courseGrades: {
            presnt: 8,
            assignments: 10,
            middleExam: 10,
            lastExam: 50,
            practice: 20,
          },
        },
        {
          courseName: 'برمجة واجهات',
          courseGrades: {
            presnt: 10,
            assignments: 10,
            middleExam: 10,
            lastExam: 50,
            practice: 20,
          },
        },
        {
          courseName: 'برمجة واجهات',
          courseGrades: {
            presnt: 10,
            assignments: 10,
            middleExam: 10,
            lastExam: 50,
            practice: 20,
          },
        },
      ],
    },
    {
      season: 'الفصل الأول',
      courses: [
        {
          courseName: 'برمجة واجهات',
          courseGrades: {
            presnt: 8,
            assignments: 10,
            middleExam: 10,
            lastExam: 50,
            practice: 20,
          },
        },
        {
          courseName: 'برمجة واجهات',
          courseGrades: {
            presnt: 10,
            assignments: 10,
            middleExam: 10,
            lastExam: 50,
            practice: 20,
          },
        },
        {
          courseName: 'برمجة واجهات',
          courseGrades: {
            presnt: 10,
            assignments: 10,
            middleExam: 10,
            lastExam: 50,
            practice: 20,
          },
        },
      ],
    },
  ],
}
var gradesTotal = []
// eslint-disable-next-line no-restricted-globals
const seasonsGrades = StudentData.grades.map(function (item, index) {
  gradesTotal.push({ seasonTatal: 0, coursesTotal: [] })
  return item.courses.map(function (course) {
    var currentCourse = Object.values(course.courseGrades)
    gradesTotal[index].seasonTatal += CourseGradesSum(currentCourse)
    gradesTotal[index].coursesTotal.push(CourseGradesSum(currentCourse))
    return [course.courseName, ...currentCourse, CourseGradesSum(currentCourse)]
  })
})
const seasonsGradesPhone = StudentData.grades.map(function (item, index) {
  return item.courses.map(function (course) {
    var currentCourse = Object.values(course.courseGrades)
    return [[course.courseName, CourseGradesSum(currentCourse)], currentCourse]
  })
})
function CourseGradesSum(courseGrades) {
  var courseSum = courseGrades.reduce((acc, deg) => acc + deg, 0)
  return courseSum
}
// const seasonsTotals = d.map(item, index)
// console.log(seasonsGrades)
console.log(seasonsGradesPhone)
// console.log(gradesTotal)
