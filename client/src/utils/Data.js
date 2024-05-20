const wordsData = {
  courses: ['البرمجة المرئية', 'تصميم وتحليل نظم', 'هندسة برمجيات', 'بنية المترجمات'],
  seasons: {
    first: 'الفصل الأول',
    second: 'الفصل الثاني',
    thired: 'الفصل الثالث',
    fourth: 'الفصل الرابع',
  },
  levels: {
    one: 'المستوى الأول',
    two: 'المستوى الثاني',
    thired: 'المستوى الثالث',
    four: 'المستوى الرابع',
  },
  callages: ['كلية الحاسب وتقنية المعلومات', 'كلية الهندسة', 'كلية الطب', 'كلية العلوم الطبيعية'],
  dates: ['2023-3-2 إلى  5-5-2023'],
  carrers: { cs: 'علوم حاسب', it: 'تقنية معلومات' },
}

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
  ],
}
var desktopTableData = {
  header: [
    'الدورة',
    'الحضور',
    'التكاليف',
    'الإختبار النصفي',
    'العملي',
    'الإختبار النهائي',
    'المجموع',
  ],
  body: [
    ['علوم حاسب', 10, 8, 10, 20, 50, 100],
    ['علوم حاسب', 10, 8, 10, 20, 50, 100],
  ],
}
var phoneTableData = {
  header: ['علوم حاسب', 100],
  body: [
    ['علوم حاسب', 10],
    ['علوم حاسب', 10],
    ['علوم حاسب', 10],
  ],
}

const CourseGradeW = {
  Course: 'الدورة',
  Present: 'الحضور',
  Assignments: 'التكاليف',
  'Middle Exam': 'الإختبار النصفي',
  'Final Exam': 'العملي',
  Practice: 'الإختبار النهائي',
  Total: 'المجموع',
}

const arWords = {
  TotalGrades: 'مجموع الدرجات',
  Grades: 'الدرجات',
  CoursesNumber: 'عدد الدورات',
  AbsoulateNum: 'النسبة المئوية',
}

export { CourseGradeW, StudentData, arWords, desktopTableData, phoneTableData, wordsData }
const d={
  "semesterManagementData": {
    "semesters": [
      {
        "title": "Fall 2022",
        "id": "1",
        "coursesNum": "3",
        "studentsNum": "50",
        "level": "Undergraduate",
        "field": "Computer Science",
        "startDate": "2022-09-01",
        "endDate": "2022-12-20",
        "completed": "false"
      }
    ]
  },
  "courseData": {
    "courseInfo": {
      "title": "Introduction to Programming",
      "subtitle": "Learn the basics of programming",
      "id": "1",
      "describtion": "This course covers fundamental programming concepts.",
      "image": "course_image.jpg",
      "secince": "Computer Science",
      "teachers": ["John Doe", "Jane Smith"],
      "requirements": ["Basic computer skills"],
      "status": "Active"
    },
    "courseSyllabus": [
      {
        "title": "Introduction to Programming Concepts",
        "id": "1",
        "lectures": [
          {
            "title": "Variables and Data Types",
            "id": "1",
            "expectedTime": "1 hour",
            "describtion": "Understanding variables and different data types in programming.",
            "video": "https://example.com/lecture1.mp4",
            "notes": "lecture1_notes.pdf",
            "file": "lecture1_additional_file.txt"
          }
        ]
      }
    ],
    "studentsGrades": [
      {
        "student": {
          "id": "1",
          "name": "Alice Johnson",
          "age": 20,
          "major": "Computer Science"
        },
        "id": "1",
        "grade": 85
      }
    ]
  },
  "collageManagementData": {
    "collages": [
      {
        "name": "Example College",
        "id": "1",
        "fieldsNum": "5"
      }
    ],
    "subjects": [
      {
        "title": "Mathematics",
        "id": "1",
        "subtitle": "Advanced Calculus"
      }
    ],
    "fields": [
      {
        "title": "Computer Science",
        "id": "1",
        "semestersNum": "8",
        "describtion": "Computer Science program description.",
        "duration": 4
      }
    ],
    "semesterTemplates": [
      {
        "title": "Standard Template",
        "id": "1",
        "subjectsNum": "5",
        "order": "1"
      }
    ]
  }
}

// console.log(['semester-templates', 'template', 'kdsfjl2jk3j4k3j4'].join('/'))