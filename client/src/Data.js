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
