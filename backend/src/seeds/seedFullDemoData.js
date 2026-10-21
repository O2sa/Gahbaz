import mongoose from "mongoose";
import env from "../config/env.js";
import { hashPassword } from "../core/utils/password.utils.js";

// Models
import University from "../models/University.js";
import User from "../models/User.js";
import Admin from "../models/Admin.js";
import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";
import College from "../models/College.js";
import Major from "../models/Major.js";
import Subject from "../models/Subject.js";
import SemesterTemplate from "../models/SemesterTemplate.js";
import Semester from "../models/Semester.js";
import Course from "../models/Course.js";
import Section from "../models/Section.js";
import Grade from "../models/Grade.js";
import Assignment from "../models/Assignment.js";
import Submission from "../models/Submission.js";
import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import PerformanceMetric from "../models/PerformanceMetric.js";
import AuditLog from "../models/AuditLog.js";

export const seedFullDemoData = async () => {
  console.log("🌱 [Seed] Starting Gahbaz Full Demo Data Setup...");

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(env.MONGO_URL);
  }

  // 1. Clear existing collections to guarantee clean, cohesive relationships
  console.log("🧹 [Seed] Cleaning existing collections...");
  await Promise.all([
    University.deleteMany({}),
    User.deleteMany({}),
    College.deleteMany({}),
    Major.deleteMany({}),
    Subject.deleteMany({}),
    SemesterTemplate.deleteMany({}),
    Semester.deleteMany({}),
    Section.deleteMany({}),
    Grade.deleteMany({}),
    Assignment.deleteMany({}),
    Submission.deleteMany({}),
    Chat.deleteMany({}),
    Message.deleteMany({}),
    PerformanceMetric.deleteMany({}),
    AuditLog.deleteMany({}),
  ]);

  // 2. University
  console.log("🏛️ [Seed] Creating University...");
  const university = await University.create({
    name: "جامعة جهبذ الوطنية الذكية",
    code: "GAHBAZ",
    active: true,
  });

  // 3. Admins
  console.log("👑 [Seed] Creating Admin Accounts...");
  const adminHashedPass = await hashPassword("admin@test.com");
  const mainAdmin = await Admin.create({
    firstName: "عبدالرحمن",
    lastName: "الغامدي",
    email: "admin@test.com",
    password: adminHashedPass,
    phone: "0501234567",
    role: "admin",
    isAdmin: true,
    university: university._id,
    permissions: "rw",
    kind: "Admin",
    lastActivity: new Date(),
  });

  university.admin = mainAdmin._id;
  await university.save();

  await Admin.create({
    firstName: "د. فيصل",
    lastName: "السالم",
    email: "faisal@gahbaz.edu",
    password: adminHashedPass,
    phone: "0509876543",
    role: "admin",
    isAdmin: true,
    university: university._id,
    permissions: "rw",
    kind: "Admin",
  });

  await Admin.create({
    firstName: "أ. نورة",
    lastName: "القاسم",
    email: "noura@gahbaz.edu",
    password: adminHashedPass,
    phone: "0505556677",
    role: "admin",
    isAdmin: true,
    university: university._id,
    permissions: "r",
    kind: "Admin",
  });

  // 4. Colleges
  console.log("🏫 [Seed] Creating Colleges...");
  const collegeCS = await College.create({
    name: "كلية علوم الحاسب والمعلوماتية",
    numberOfSemesters: 8,
    university: university._id,
  });

  const collegeEng = await College.create({
    name: "كلية الهندسة والعمارة",
    numberOfSemesters: 10,
    university: university._id,
  });

  const collegeBusiness = await College.create({
    name: "كلية إدارة الأعمال ونظم المعلومات",
    numberOfSemesters: 8,
    university: university._id,
  });

  // 5. Majors
  console.log("🎓 [Seed] Creating Majors...");
  const majorSE = await Major.create({
    name: "هندسة البرمجيات والنظم الذكية",
    college: collegeCS._id,
  });

  const majorAI = await Major.create({
    name: "الذكاء الاصطناعي وعلم البيانات",
    college: collegeCS._id,
  });

  const majorSec = await Major.create({
    name: "الأمن السيبراني وشبكات الحاسب",
    college: collegeCS._id,
  });

  const majorMIS = await Major.create({
    name: "نظم المعلومات الإدارية والتحول الرقمي",
    college: collegeBusiness._id,
  });

  // 6. Teachers
  console.log("👨‍🏫 [Seed] Creating Teachers...");
  const teacherHashedPass = await hashPassword("teacher@tech.com");

  const teacherDemo = await Teacher.create({
    firstName: "د. فهد",
    lastName: "الشمري",
    email: "teacher@tech.com",
    password: teacherHashedPass,
    phone: "0559876543",
    role: "teacher",
    university: university._id,
    title: "أستاذ مشارك - هندسة البرمجيات",
    kind: "Teacher",
    lastActivity: new Date(),
  });

  const teacherSara = await Teacher.create({
    firstName: "د. سارة",
    lastName: "العتيبي",
    email: "sara.otaibi@gahbaz.edu",
    password: teacherHashedPass,
    phone: "0551122334",
    role: "teacher",
    university: university._id,
    title: "أستاذ مشارك - الذكاء الاصطناعي",
    kind: "Teacher",
  });

  const teacherTariq = await Teacher.create({
    firstName: "د. طارق",
    lastName: "الزهراني",
    email: "tariq.zahrani@gahbaz.edu",
    password: teacherHashedPass,
    phone: "0552233445",
    role: "teacher",
    university: university._id,
    title: "أستاذ مساعد - الأمن السيبراني",
    kind: "Teacher",
  });

  const teacherReem = await Teacher.create({
    firstName: "د. ريم",
    lastName: "الدوسري",
    email: "reem.dosari@gahbaz.edu",
    password: teacherHashedPass,
    phone: "0553344556",
    role: "teacher",
    university: university._id,
    title: "أستاذ مساعد - قواعد البيانات",
    kind: "Teacher",
  });

  // 7. Students
  console.log("👨‍🎓 [Seed] Creating Students...");
  const studentHashedPass = await hashPassword("student@test.com");

  const studentDemo = await Student.create({
    firstName: "عبدالله",
    lastName: "الشهري",
    email: "student@test.com",
    password: studentHashedPass,
    phone: "0541122334",
    role: "student",
    university: university._id,
    major: majorSE._id,
    comingSemester: 5,
    kind: "Student",
    lastActivity: new Date(),
  });

  const studentsList = [
    { firstName: "سارة", lastName: "الأحمد", email: "sara.ahmed@student.gahbaz.edu", major: majorSE._id, phone: "0542233445" },
    { firstName: "عمر", lastName: "الدوسري", email: "omar.dosari@student.gahbaz.edu", major: majorSE._id, phone: "0543344556" },
    { firstName: "لمى", lastName: "العتيق", email: "lama.ateeq@student.gahbaz.edu", major: majorAI._id, phone: "0544455667" },
    { firstName: "فيصل", lastName: "المطيري", email: "faisal.mutairi@student.gahbaz.edu", major: majorAI._id, phone: "0545566778" },
    { firstName: "رغد", lastName: "المنصور", email: "raghad.mansoor@student.gahbaz.edu", major: majorSec._id, phone: "0546677889" },
    { firstName: "محمد", lastName: "القحطاني", email: "m.qahtani@student.gahbaz.edu", major: majorSec._id, phone: "0547788990" },
    { firstName: "شهد", lastName: "الحارثي", email: "shahad.harthi@student.gahbaz.edu", major: majorSE._id, phone: "0548899001" },
    { firstName: "خالد", lastName: "العتيبي", email: "khalid.otaibi@student.gahbaz.edu", major: majorMIS._id, phone: "0549900112" },
  ];

  const createdStudents = [studentDemo];
  for (const s of studentsList) {
    const studentDoc = await Student.create({
      firstName: s.firstName,
      lastName: s.lastName,
      email: s.email,
      password: studentHashedPass,
      phone: s.phone,
      role: "student",
      university: university._id,
      major: s.major,
      comingSemester: 5,
      kind: "Student",
    });
    createdStudents.push(studentDoc);
  }

  // 8. Subjects
  console.log("📚 [Seed] Creating Academic Subjects...");
  const subjectAlgo = await Subject.create({
    name: "تصميم وتحليل الخوارزميات",
    code: "CS301",
    subtitle: "المفاهيم المتقدمة في هياكل البيانات وكفاءة الخوارزميات",
    category: "علوم الحاسب",
    college: collegeCS._id,
    teachers: [teacherSara._id],
    creditHours: 3,
    gradeSchema: {
      total: 100,
      grade: {
        0: { name: "تكاليف ومشاريع", value: 20 },
        1: { name: "اختبار نصفي", value: 30 },
        2: { name: "اختبار نهائي", value: 50 },
      },
    },
  });

  const subjectSE = await Subject.create({
    name: "هندسة البرمجيات المتقدمة",
    code: "SE310",
    subtitle: "معماريات البرمجيات، أنماط التصميم وممارسات Agile و CI/CD",
    category: "هندسة البرمجيات",
    college: collegeCS._id,
    teachers: [teacherDemo._id],
    creditHours: 3,
    gradeSchema: {
      total: 100,
      grade: {
        0: { name: "تكاليف ومشاريع", value: 25 },
        1: { name: "اختبار نصفي", value: 25 },
        2: { name: "اختبار نهائي", value: 50 },
      },
    },
  });

  const subjectAI = await Subject.create({
    name: "الذكاء الاصطناعي وتعلم الآلة",
    code: "AI401",
    subtitle: "أساسيات التعلم الآلي والشبكات العصبية وتطبيقاتها المعاصرة",
    category: "الذكاء الاصطناعي",
    college: collegeCS._id,
    teachers: [teacherSara._id],
    creditHours: 3,
    gradeSchema: {
      total: 100,
      grade: {
        0: { name: "تكاليف ومشاريع", value: 30 },
        1: { name: "اختبار نصفي", value: 30 },
        2: { name: "اختبار نهائي", value: 40 },
      },
    },
  });

  const subjectSec = await Subject.create({
    name: "أمن المعلومات والشبكات",
    code: "SEC350",
    subtitle: "التشفير، حماية الشبكات والتحليل الأمني للهجمات السيبرانية",
    category: "الأمن السيبراني",
    college: collegeCS._id,
    teachers: [teacherTariq._id],
    creditHours: 3,
    gradeSchema: {
      total: 100,
      grade: {
        0: { name: "مختبر وتكاليف", value: 20 },
        1: { name: "اختبار نصفي", value: 30 },
        2: { name: "اختبار نهائي", value: 50 },
      },
    },
  });

  const subjectDB = await Subject.create({
    name: "قواعد البيانات ونظم المعلومات",
    code: "DB220",
    subtitle: "تصميم قواعد البيانات العلائقية ونظم SQL و NoSQL",
    category: "قواعد البيانات",
    college: collegeCS._id,
    teachers: [teacherReem._id],
    creditHours: 3,
    gradeSchema: {
      total: 100,
      grade: {
        0: { name: "تكاليف ومشروع", value: 20 },
        1: { name: "اختبار نصفي", value: 30 },
        2: { name: "اختبار نهائي", value: 50 },
      },
    },
  });

  // 9. Semester Templates
  console.log("📋 [Seed] Creating Semester Templates...");
  const templateSE4 = await SemesterTemplate.create({
    name: "المستوى الرابع - هندسة البرمجيات",
    major: majorSE._id,
    index: 4,
    active: false,
    subjects: [subjectAlgo._id, subjectDB._id],
  });

  const templateSE5 = await SemesterTemplate.create({
    name: "المستوى الخامس - هندسة البرمجيات",
    major: majorSE._id,
    index: 5,
    active: true,
    subjects: [subjectSE._id, subjectAlgo._id, subjectAI._id, subjectSec._id, subjectDB._id],
  });

  majorSE.semesterTemplates = [templateSE4._id, templateSE5._id];
  await majorSE.save();

  // 10. Semesters
  console.log("🗓️ [Seed] Creating Academic Semesters...");
  const pastSemester = await Semester.create({
    name: "الفصل الدراسي الثاني 2025/2026 (المستوى الرابع)",
    major: majorSE._id,
    template: templateSE4._id,
    university: university._id,
    startDate: new Date("2026-01-15"),
    endDate: new Date("2026-05-30"),
    completed: true,
    students: [studentDemo._id, createdStudents[1]._id, createdStudents[2]._id],
  });

  const currentSemester = await Semester.create({
    name: "الفصل الدراسي الأول 2026/2027 (المستوى الخامس)",
    major: majorSE._id,
    template: templateSE5._id,
    university: university._id,
    startDate: new Date("2026-08-20"),
    endDate: new Date("2026-12-30"),
    completed: false,
    students: createdStudents.map((s) => s._id),
  });

  majorSE.semesters = [pastSemester._id, currentSemester._id];
  await majorSE.save();

  // Enroll demo student in both past and current semesters for official transcript calculation
  studentDemo.semesters = [pastSemester._id, currentSemester._id];
  await studentDemo.save();

  for (let i = 1; i < createdStudents.length; i++) {
    createdStudents[i].semesters = [currentSemester._id];
    await createdStudents[i].save();
  }

  // 11. Past Courses (Completed with Grades for Transcript GPA)
  console.log("🎓 [Seed] Creating Completed Past Courses & Official Records...");
  const pastCourseOOP = await Course.create({
    name: "البرمجة الكائنية المتقدمة (CS201)",
    code: "CS201-S26",
    subtitle: "مفاهيم التجريد والوراثة وتعدد الأشكال وتصميم البرمجيات",
    category: "علوم الحاسب",
    college: collegeCS._id,
    teachers: [teacherDemo._id],
    semester: pastSemester._id,
    university: university._id,
    status: "done",
    creditHours: 3,
    description: "مقرر أساسي متعمق في البرمجة الكائنية OOP وتطبيقاتها العملية.",
    students: [{ student: studentDemo._id }],
  });

  const pastCourseDS = await Course.create({
    name: "هياكل البيانات والملفات (CS202)",
    code: "CS202-S26",
    subtitle: "المصفوفات، القوائم المترابطة، الأشجار الثنائية وجداول التجزئة",
    category: "علوم الحاسب",
    college: collegeCS._id,
    teachers: [teacherSara._id],
    semester: pastSemester._id,
    university: university._id,
    status: "done",
    creditHours: 3,
    description: "بناء وفهم هياكل البيانات وكفاءة العمليات عليها.",
    students: [{ student: studentDemo._id }],
  });

  const pastCourseMath = await Course.create({
    name: "الرياضيات المتقطعة للحاسب (MATH210)",
    code: "MATH210-S26",
    subtitle: "نظرية المجموعات، المنطق الرياضي، والعلاقات والرسوم البيانية",
    category: "علوم الحاسب",
    college: collegeCS._id,
    teachers: [teacherTariq._id],
    semester: pastSemester._id,
    university: university._id,
    status: "done",
    creditHours: 3,
    description: "الأسس الرياضية لنظرية الحوسبة والمنطق البرمجي.",
    students: [{ student: studentDemo._id }],
  });

  pastSemester.courses = [pastCourseOOP._id, pastCourseDS._id, pastCourseMath._id];
  await pastSemester.save();

  // Create Past Grades (High GPA: 96, 94, 98 -> A+)
  const gradeOOP = await Grade.create({
    course: pastCourseOOP._id,
    student: studentDemo._id,
    total: 96,
    percent: 96,
    grades: [
      { key: "assignments", name: "تكاليف ومشاريع", maxValue: 20, value: 20 },
      { key: "midterm", name: "اختبار نصفي", maxValue: 30, value: 28 },
      { key: "final", name: "اختبار نهائي", maxValue: 50, value: 48 },
    ],
    grade: {
      0: { name: "تكاليف ومشاريع", value: 20 },
      1: { name: "اختبار نصفي", value: 28 },
      2: { name: "اختبار نهائي", value: 48 },
    },
  });

  const gradeDS = await Grade.create({
    course: pastCourseDS._id,
    student: studentDemo._id,
    total: 94,
    percent: 94,
    grades: [
      { key: "assignments", name: "تكاليف ومشاريع", maxValue: 20, value: 19 },
      { key: "midterm", name: "اختبار نصفي", maxValue: 30, value: 28 },
      { key: "final", name: "اختبار نهائي", maxValue: 50, value: 47 },
    ],
    grade: {
      0: { name: "تكاليف ومشاريع", value: 19 },
      1: { name: "اختبار نصفي", value: 28 },
      2: { name: "اختبار نهائي", value: 47 },
    },
  });

  const gradeMath = await Grade.create({
    course: pastCourseMath._id,
    student: studentDemo._id,
    total: 98,
    percent: 98,
    grades: [
      { key: "assignments", name: "تكاليف ومشاريع", maxValue: 20, value: 20 },
      { key: "midterm", name: "اختبار نصفي", maxValue: 30, value: 30 },
      { key: "final", name: "اختبار نهائي", maxValue: 50, value: 48 },
    ],
    grade: {
      0: { name: "تكاليف ومشاريع", value: 20 },
      1: { name: "اختبار نصفي", value: 30 },
      2: { name: "اختبار نهائي", value: 48 },
    },
  });

  // 12. Current Active Courses
  console.log("📖 [Seed] Creating Active Semester Courses...");
  const courseSE = await Course.create({
    name: "هندسة البرمجيات المتقدمة (SE310)",
    code: "SE310-F26",
    subtitle: "معماريات البرمجيات، أنماط التصميم وممارسات CI/CD الحديثة",
    category: "هندسة البرمجيات",
    college: collegeCS._id,
    teachers: [teacherDemo._id],
    semester: currentSemester._id,
    university: university._id,
    status: "active",
    creditHours: 3,
    description: "مقرر شامل يغطي التحول المعماري نحو الخدمات المصغرة Microservices، تطبيق مبادئ Clean Architecture و SOLID، وبناء خطوط أنابيب التكامل المستمر.",
    requirements: [
      "إتقان مبادئ البرمجة الكائنية OOP",
      "معرفة جيدة بمفاهيم قواعد البيانات وتصميم واجهات برمجة التطبيقات APIs",
    ],
    willLearn: [
      "تصميم معماريات برمجية قابلة للتوسع والصيانة",
      "تطبيق أنماط التصميم Design Patterns في سيناريوهات عملية",
      "أتمتة الاختبارات البرمجية وإعداد خطوط CI/CD",
      "إدارة فرق التطوير باستخدام منهجية Agile",
    ],
    students: createdStudents.map((s) => ({ student: s._id })),
  });

  const courseAlgo = await Course.create({
    name: "تصميم وتحليل الخوارزميات (CS301)",
    code: "CS301-F26",
    subtitle: "المفاهيم المتقدمة في هياكل البيانات وكفاءة الخوارزميات",
    category: "علوم الحاسب",
    college: collegeCS._id,
    teachers: [teacherSara._id],
    semester: currentSemester._id,
    university: university._id,
    status: "active",
    creditHours: 3,
    description: "دراسة عميقة لخوارزميات البحث والترتيب والبرمجة الديناميكية Dynamic Programming مع تحليل التعقيد الزمني والمكاني Big-O.",
    requirements: ["هياكل البيانات الأساسية", "مقدمة في البرمجة المتقدمة"],
    willLearn: [
      "تحليل الكفاءة الزمنية والمكانية للخوارزميات",
      "حل المشكلات المعقدة بالبرمجة الديناميكية",
      "خوارزميات الرسوم البيانية Graph Algorithms وتطبيقاتها",
    ],
    students: createdStudents.map((s) => ({ student: s._id })),
  });

  const courseAI = await Course.create({
    name: "الذكاء الاصطناعي وتعلم الآلة (AI401)",
    code: "AI401-F26",
    subtitle: "مقدمة في خوارزميات التعلم الآلي والشبكات العصبية العميقة",
    category: "الذكاء الاصطناعي",
    college: collegeCS._id,
    teachers: [teacherSara._id],
    semester: currentSemester._id,
    university: university._id,
    status: "active",
    creditHours: 3,
    description: "بناء النماذج التنبؤية، خوارزميات التصنيف والانحدار، ومقدمة في معالجة اللغات الطبيعية NLP ورؤية الحاسوب.",
    requirements: ["الجبر الخطي وحساب التفاضل", "برمجة لغة بايثون"],
    willLearn: [
      "بناء وتدريب نماذج التعلم الخاضع للإشراف Supervised Learning",
      "فهم وتطبيق خوارزميات الشبكات العصبية العميقة",
      "تقييم كفاءة النماذج ومنع فرط الملاءمة Overfitting",
    ],
    students: createdStudents.map((s) => ({ student: s._id })),
  });

  const courseSec = await Course.create({
    name: "أمن المعلومات والشبكات (SEC350)",
    code: "SEC350-F26",
    subtitle: "مبادئ الأمن السيبراني، التشفير، وحماية البنية التحتية",
    category: "الأمن السيبراني",
    college: collegeCS._id,
    teachers: [teacherTariq._id],
    semester: currentSemester._id,
    university: university._id,
    status: "active",
    creditHours: 3,
    description: "دراسة تقنيات التشفير المتماثل وغير المتماثل، جدران الحماية، اكتشاف الاختراقات وتأمين خوادم وتطبيقات الويب.",
    requirements: ["أساسيات شبكات الحاسب", "مبادئ أنظمة التشغيل"],
    willLearn: [
      "تطبيق خوارزميات التشفير وإدارة المفاتيح",
      "تحديد الثغرات الأمنية الشائعة وطرق سدها",
      "حماية الشبكات السحابية من هجمات الحرمان من الخدمة DDoS",
    ],
    students: createdStudents.map((s) => ({ student: s._id })),
  });

  const courseDB = await Course.create({
    name: "قواعد البيانات ونظم المعلومات (DB220)",
    code: "DB220-F26",
    subtitle: "تصميم قواعد البيانات العلائقية ونظم SQL و NoSQL",
    category: "قواعد البيانات",
    college: collegeCS._id,
    teachers: [teacherReem._id],
    semester: currentSemester._id,
    university: university._id,
    status: "active",
    creditHours: 3,
    description: "تصميم قواعد البيانات الحديثة، إدارة المعاملات ACID، والفهرسة المتقدمة مع NoSQL MongoDB.",
    requirements: ["مبادئ قواعد البيانات"],
    willLearn: ["تصميم مخططات E-R متكاملة", "استعلامات SQL و Aggregation متقدمة", "تحسين الأداء والفهرسة"],
    students: createdStudents.map((s) => ({ student: s._id })),
  });

  currentSemester.courses = [courseSE._id, courseAlgo._id, courseAI._id, courseSec._id, courseDB._id];
  await currentSemester.save();

  // Assign courses to teacher profiles
  teacherDemo.courses = [courseSE._id];
  await teacherDemo.save();

  teacherSara.courses = [courseAlgo._id, courseAI._id];
  await teacherSara.save();

  teacherTariq.courses = [courseSec._id];
  await teacherTariq.save();

  teacherReem.courses = [courseDB._id];
  await teacherReem.save();

  // 13. Syllabus Sections and Lessons
  console.log("📑 [Seed] Adding Syllabus Sections and Lessons...");
  // SE310 Sections
  const secSE1 = await Section.create({
    name: "الوحدة الأولى: أسس المعمارية البرمجية",
    course: courseSE._id,
    lessons: [
      {
        name: "الدرس الأول: مقدمة في المعماريات الحديثة ومفهوم الـ Architecture Drivers",
        video: { url: "https://www.youtube.com/watch?v=sample1", duration: 1800 },
        topic: { data: "نظرة عامة على دور مهندس البرمجيات، وكيفية موازنة متطلبات الجودة (الأداء، الأمان، القابلية للتوسع).", readingTime: 15 },
      },
      {
        name: "الدرس الثاني: مبادئ SOLID وتطبيقاتها في هندسة النظم النظيفة",
        video: { url: "https://www.youtube.com/watch?v=sample2", duration: 2400 },
        topic: { data: "شرح تفصيلي للمبادئ الخمسة مع أمثلة عملية بلغة JavaScript/TypeScript ونماذج كود نظيف.", readingTime: 20 },
      },
    ],
  });

  const secSE2 = await Section.create({
    name: "الوحدة الثانية: أنماط التصميم والخدمات المصغرة",
    course: courseSE._id,
    lessons: [
      {
        name: "الدرس الثالث: التصميم المستند إلى النطاق Domain-Driven Design (DDD)",
        video: { url: "https://www.youtube.com/watch?v=sample3", duration: 2700 },
        topic: { data: "كيفية تقسيم النظم الكبيرة إلى Bounded Contexts مستقلة وقابلة للنشر المستقل.", readingTime: 25 },
      },
      {
        name: "الدرس الرابع: التكامل غير المتزامن وإدارة الأحداث Event-Driven Architecture",
        video: { url: "https://www.youtube.com/watch?v=sample4", duration: 2100 },
        topic: { data: "استخدام Message Brokers وتنسيق الرسائل بين الخدمات مع معالجة حالات الفشل.", readingTime: 30 },
      },
    ],
  });

  const secSE3 = await Section.create({
    name: "الوحدة الثالثة: جودة البرمجيات وأتمتة النشر CI/CD",
    course: courseSE._id,
    lessons: [
      {
        name: "الدرس الخامس: أتمتة الاختبارات وتطبيق استراتيجية Test Pyramid",
        video: { url: "https://www.youtube.com/watch?v=sample5", duration: 2000 },
        topic: { data: "كتابة اختبارات الوحدة واختبارات التكامل لضمان استقرار النظام وموثوقية الكود.", readingTime: 20 },
      },
    ],
  });
  courseSE.sections = [secSE1._id, secSE2._id, secSE3._id];
  await courseSE.save();

  // CS301 Sections
  const secAlgo1 = await Section.create({
    name: "الوحدة الأولى: تحليل التعقيد والخوارزميات",
    course: courseAlgo._id,
    lessons: [
      {
        name: "الدرس الأول: التحليل التقاربي ونظرية Master Theorem",
        video: { url: "https://www.youtube.com/watch?v=algo1", duration: 2100 },
        topic: { data: "حساب التعقيد الزمني والمكاني باستخدام Big-O وحل معادلات التكرار Recurrences.", readingTime: 25 },
      },
      {
        name: "الدرس الثاني: خوارزميات الترتيب المتقدم والبحث الثنائي",
        video: { url: "https://www.youtube.com/watch?v=algo2", duration: 2400 },
        topic: { data: "تطبيق QuickSort و MergeSort وتحليل أفضل وأسوأ الحالات مع التمثيل البياني.", readingTime: 20 },
      },
    ],
  });

  const secAlgo2 = await Section.create({
    name: "الوحدة الثانية: البرمجة الديناميكية",
    course: courseAlgo._id,
    lessons: [
      {
        name: "الدرس الثالث: مبادئ البرمجة الديناميكية Dynamic Programming",
        video: { url: "https://www.youtube.com/watch?v=algo3", duration: 2700 },
        topic: { data: "استراتيجيات Memoization و Tabulation مع أمثلة عملية لمسائل الحقيبة والمسار الأقصر.", readingTime: 30 },
      },
    ],
  });
  courseAlgo.sections = [secAlgo1._id, secAlgo2._id];
  await courseAlgo.save();

  // AI401 Sections
  const secAI1 = await Section.create({
    name: "الوحدة الأولى: أساسيات التعلم الآلي",
    course: courseAI._id,
    lessons: [
      {
        name: "الدرس الأول: الانحدار الخطي والتصنيف اللوجستي Linear & Logistic Regression",
        video: { url: "https://www.youtube.com/watch?v=ai1", duration: 2200 },
        topic: { data: "مفهوم Gradient Descent ودوال التكلفة Cost Functions مع تطبيق بلغة بايثون.", readingTime: 25 },
      },
      {
        name: "الدرس الثاني: تقييم النماذج ومصفوفة الالتباس Confusion Matrix",
        video: { url: "https://www.youtube.com/watch?v=ai2", duration: 1900 },
        topic: { data: "مقاييس الدقة Precision و Recall و F1-Score والتحقق المتقاطع Cross-Validation.", readingTime: 20 },
      },
    ],
  });
  courseAI.sections = [secAI1._id];
  await courseAI.save();

  // SEC350 Sections
  const secSec1 = await Section.create({
    name: "الوحدة الأولى: أسس التشفير والأمن",
    course: courseSec._id,
    lessons: [
      {
        name: "الدرس الأول: التشفير المتماثل وغير المتماثل ومبادئ AES / RSA",
        video: { url: "https://www.youtube.com/watch?v=sec1", duration: 2300 },
        topic: { data: "إدارة المفاتيح، التوقيع الرقمي والشهادات الرقمية SSL/TLS.", readingTime: 25 },
      },
    ],
  });
  courseSec.sections = [secSec1._id];
  await courseSec.save();

  // 14. Course Assignments & Submissions
  console.log("📝 [Seed] Creating Coursework Assignments & Student Submissions...");
  
  // SE310 Assignments
  const assignSE1 = await Assignment.create({
    course: courseSE._id,
    teacher: teacherDemo._id,
    university: university._id,
    title: "مشروع المعمارية البرمجية C4 وتصميم الخدمات المصغرة",
    description: "قم بإعداد تقرير هندسي كامل يوضح مستويات المعمارية C4 Model ونقاط نهاية RESTful APIs مع تحديد استراتيجية التحمل للأخطاء Fault Tolerance.",
    dueDate: new Date(Date.now() + 7 * 24 * 3600 * 1000),
    maxScore: 15,
  });

  const assignSE2 = await Assignment.create({
    course: courseSE._id,
    teacher: teacherDemo._id,
    university: university._id,
    title: "تطبيق مبادئ SOLID ونمط Clean Architecture",
    description: "بناء مشروع تجريبي يوضح فصل طبقات النطاق Domain والبنية التحتية Infrastructure مع تطبيق Dependency Inversion.",
    dueDate: new Date(Date.now() + 14 * 24 * 3600 * 1000),
    maxScore: 10,
  });

  // CS301 Assignment
  const assignAlgo1 = await Assignment.create({
    course: courseAlgo._id,
    teacher: teacherSara._id,
    university: university._id,
    title: "تحليل كفاءة خوارزميات الترتيب والبحث في الذاكرة",
    description: "كتابة برنامج بلغة C++ أو بايثون يقارن بين أداء 3 خوارزميات ترتيب مع رسوم بيانية توضح التعقيد الزمني.",
    dueDate: new Date(Date.now() + 5 * 24 * 3600 * 1000),
    maxScore: 20,
  });

  // AI401 Assignment
  const assignAI1 = await Assignment.create({
    course: courseAI._id,
    teacher: teacherSara._id,
    university: university._id,
    title: "بناء نموذج تصنيف بيانات باستخدام Scikit-Learn",
    description: "تدريب نموذج تصنيف لبيانات طبية وتطبيق تقنيات منع فرط الملاءمة Overfitting مع تقرير التحقق.",
    dueDate: new Date(Date.now() + 10 * 24 * 3600 * 1000),
    maxScore: 20,
  });

  // Student Submissions for SE310
  await Submission.create({
    assignment: assignSE1._id,
    course: courseSE._id,
    student: studentDemo._id,
    university: university._id,
    fileUrl: "https://gahbaz.edu/storage/submissions/se310_c4_demo_student.pdf",
    notes: "تم إرفاق المخططات وتوثيق واجهات OpenAPI كاملة بصيغة PDF.",
    submittedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000),
    grade: 15,
    feedback: "عمل ممتاز ومفصل للغاية! تطبيق دقيق لمستويات التجريد في مخططات C4 ونموذج النطاق DDD.",
    gradedBy: teacherDemo._id,
    gradedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000),
    status: "graded",
  });

  await Submission.create({
    assignment: assignSE2._id,
    course: courseSE._id,
    student: studentDemo._id,
    university: university._id,
    fileUrl: "https://gahbaz.edu/storage/submissions/se310_solid_code.zip",
    notes: "تم تسليم كود المشروع مع اختبارات الوحدة Unit Tests بنسبة تغطية 85%.",
    submittedAt: new Date(Date.now() - 4 * 3600 * 1000),
    status: "submitted",
  });

  // Other students submissions
  await Submission.create({
    assignment: assignSE1._id,
    course: courseSE._id,
    student: createdStudents[1]._id, // Sara Ahmed
    university: university._id,
    fileUrl: "https://gahbaz.edu/storage/submissions/se310_sara_ahmed.pdf",
    notes: "مخطط معمارية نظام إدارة المستشفيات C4.",
    submittedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000),
    grade: 14.5,
    feedback: "تصميم ممتاز ومترابط، ملاحظة بسيطة بخصوص توثيق كاشف الأخطاء Circuit Breaker.",
    gradedBy: teacherDemo._id,
    gradedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000),
    status: "graded",
  });

  await Submission.create({
    assignment: assignAlgo1._id,
    course: courseAlgo._id,
    student: studentDemo._id,
    university: university._id,
    fileUrl: "https://gahbaz.edu/storage/submissions/cs301_algorithms_benchmark.pdf",
    notes: "مقارنة عملية بين QuickSort و HeapSort مع كود بايثون للقياس.",
    submittedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000),
    grade: 19,
    feedback: "تحليل ممتاز ودقيق لمنحنيات الأداء الحقيقي مقارنة بالتحليل النظري Big-O.",
    gradedBy: teacherSara._id,
    gradedAt: new Date(Date.now() - 6 * 3600 * 1000),
    status: "graded",
  });

  // 15. Student Current Term Grades
  console.log("📊 [Seed] Recording Active Term Student Grades...");
  const activeCourses = [courseSE, courseAlgo, courseAI, courseSec, courseDB];
  const demoStudentGrades = [];

  for (const c of activeCourses) {
    for (const s of createdStudents) {
      const isDemo = s.email === "student@test.com";
      const assignmentsVal = isDemo ? (c.code.includes("SE310") ? 25 : 19) : Math.floor(Math.random() * 5) + 18;
      const midtermVal = isDemo ? (c.code.includes("SE310") ? 24 : 27) : Math.floor(Math.random() * 6) + 22;
      const finalVal = isDemo ? (c.code.includes("SE310") ? 48 : 45) : Math.floor(Math.random() * 10) + 38;
      const total = assignmentsVal + midtermVal + finalVal;

      const gradeDoc = await Grade.create({
        course: c._id,
        student: s._id,
        total,
        percent: total,
        grades: [
          { key: "assignments", name: "تكاليف ومشاريع", maxValue: 25, value: assignmentsVal },
          { key: "midterm", name: "اختبار نصفي", maxValue: 25, value: midtermVal },
          { key: "final", name: "اختبار نهائي", maxValue: 50, value: finalVal },
        ],
        grade: {
          0: { name: "تكاليف ومشاريع", value: assignmentsVal },
          1: { name: "اختبار نصفي", value: midtermVal },
          2: { name: "اختبار نهائي", value: finalVal },
        },
      });

      if (isDemo) {
        demoStudentGrades.push(gradeDoc._id);
      }
    }
  }

  // Attach all past & current grades to student demo profile
  studentDemo.grades = [gradeOOP._id, gradeDS._id, gradeMath._id, ...demoStudentGrades];
  await studentDemo.save();

  // 16. Chat Rooms and Messages (For All Courses & Direct Messaging)
  console.log("💬 [Seed] Creating Academic Course Discussion Rooms & Direct Chats...");
  
  // SE310 Course Chat
  const seChat = await Chat.create({
    chatName: "قاعة نقاش مقرر هندسة البرمجيات (SE310)",
    isGroupChat: true,
    groupAdmin: teacherDemo._id,
    university: university._id,
    users: [mainAdmin._id, teacherDemo._id, studentDemo._id, createdStudents[1]._id, createdStudents[2]._id],
  });

  const seMsg1 = await Message.create({
    content: "السلام عليكم ورحمة الله وبركاته، مرحباً بكم جميعاً في مقرر هندسة البرمجيات المتقدمة. تم رفع توصيف المقرر والوحدات الأولى على المنصة.",
    sender: teacherDemo._id,
    chat: seChat._id,
    readBy: [studentDemo._id, mainAdmin._id],
    createdAt: new Date(Date.now() - 48 * 3600 * 1000),
  });

  const seMsg2 = await Message.create({
    content: "وعليكم السلام دكتور فهد، أهلاً بك. هل تم تحديد موعد تسليم المشروع الفصلي للوحدة الأولى؟",
    sender: studentDemo._id,
    chat: seChat._id,
    readBy: [teacherDemo._id, mainAdmin._id],
    createdAt: new Date(Date.now() - 24 * 3600 * 1000),
  });

  const seMsg3 = await Message.create({
    content: "نعم عبدالله، موعد التسليم بعد أسبوع من الآن، وسيتم تخصيص جزء من المحاضرة القادمة للإجابة على أي استفسارات تخص المعمارية.",
    sender: teacherDemo._id,
    chat: seChat._id,
    readBy: [studentDemo._id, mainAdmin._id],
    createdAt: new Date(Date.now() - 4 * 3600 * 1000),
  });

  const seMsg4 = await Message.create({
    content: "دكتور هل يمكن استخدام Docker Compose لربط الخدمات المصغرة محلياً أثناء العرض التجريبي؟",
    sender: createdStudents[1]._id, // Sara Ahmed
    chat: seChat._id,
    readBy: [teacherDemo._id, studentDemo._id],
    createdAt: new Date(Date.now() - 2 * 3600 * 1000),
  });

  const seMsg5 = await Message.create({
    content: "نعم بالتأكيد يا سارة، استخدام Docker و Docker Compose مستحسن ويعطي درجات إضافية في معيار جودة النشر.",
    sender: teacherDemo._id,
    chat: seChat._id,
    readBy: [studentDemo._id],
    createdAt: new Date(Date.now() - 1 * 3600 * 1000),
  });

  seChat.latestMessage = seMsg5._id;
  await seChat.save();

  // CS301 Course Chat
  const algoChat = await Chat.create({
    chatName: "قاعة نقاش مقرر تصميم وتحليل الخوارزميات (CS301)",
    isGroupChat: true,
    groupAdmin: teacherSara._id,
    university: university._id,
    users: [teacherSara._id, studentDemo._id, createdStudents[1]._id, createdStudents[2]._id],
  });

  const algoMsg1 = await Message.create({
    content: "أعزائي الطلاب، تم رفع الواجب الأول الخاص بمقارنة تعقيد الخوارزميات. الموعد النهائي محدد بنهاية الأسبوع.",
    sender: teacherSara._id,
    chat: algoChat._id,
    readBy: [studentDemo._id],
    createdAt: new Date(Date.now() - 20 * 3600 * 1000),
  });

  const algoMsg2 = await Message.create({
    content: "شكراً دكتورة سارة، هل التحليل النظري لمصفوفات التكرار كافٍ أم يتطلب اختبارات عملية في الكود؟",
    sender: studentDemo._id,
    chat: algoChat._id,
    readBy: [teacherSara._id],
    createdAt: new Date(Date.now() - 10 * 3600 * 1000),
  });

  const algoMsg3 = await Message.create({
    content: "المطلوب كلاهما يا عبدالله: التحليل الرياضي بالإضافة إلى كود بايثون يقيس الوقت الفعلي بالميكروثانية.",
    sender: teacherSara._id,
    chat: algoChat._id,
    readBy: [studentDemo._id],
    createdAt: new Date(Date.now() - 3 * 3600 * 1000),
  });

  algoChat.latestMessage = algoMsg3._id;
  await algoChat.save();

  // AI401 Course Chat
  const aiChat = await Chat.create({
    chatName: "قاعة نقاش مقرر الذكاء الاصطناعي وتعلم الآلة (AI401)",
    isGroupChat: true,
    groupAdmin: teacherSara._id,
    university: university._id,
    users: [teacherSara._id, studentDemo._id, createdStudents[3]._id, createdStudents[4]._id],
  });

  const aiMsg1 = await Message.create({
    content: "مرحباً بكم في مقرر الذكاء الاصطناعي. سنبدأ الأسبوع القادم في تطبيقات الشبكات العصبية العميقة CNN.",
    sender: teacherSara._id,
    chat: aiChat._id,
    readBy: [studentDemo._id],
    createdAt: new Date(Date.now() - 15 * 3600 * 1000),
  });

  aiChat.latestMessage = aiMsg1._id;
  await aiChat.save();

  // SEC350 Course Chat
  const secChat = await Chat.create({
    chatName: "قاعة نقاش مقرر أمن المعلومات والشبكات (SEC350)",
    isGroupChat: true,
    groupAdmin: teacherTariq._id,
    university: university._id,
    users: [teacherTariq._id, studentDemo._id, createdStudents[5]._id],
  });

  const secMsg1 = await Message.create({
    content: "تذكير لجميع الطلاب: مختبر الغد سيتضمن تجربة عملية لاختراق واكتشاف الثغرات في بيئة معزولة Sandbox.",
    sender: teacherTariq._id,
    chat: secChat._id,
    readBy: [studentDemo._id],
    createdAt: new Date(Date.now() - 8 * 3600 * 1000),
  });

  secChat.latestMessage = secMsg1._id;
  await secChat.save();

  // Direct Chat: Admin & Teacher
  const adminDirectChat = await Chat.create({
    chatName: "تنسيق متطلبات الاعتماد الأكاديمي لمقررات الخريف",
    isGroupChat: false,
    university: university._id,
    users: [mainAdmin._id, teacherDemo._id],
  });

  const adminMsg1 = await Message.create({
    content: "د. فهد، نرجو مراجعة مخرجات تعلم مقرر SE310 واعتمادها في لوحة التحكم.",
    sender: mainAdmin._id,
    chat: adminDirectChat._id,
    readBy: [teacherDemo._id],
    createdAt: new Date(Date.now() - 12 * 3600 * 1000),
  });

  const adminMsg2 = await Message.create({
    content: "تمت المراجعة والتأكد من مطابقة جميع معايير ABET، وسأقوم برفع تقرير التقييم اليوم.",
    sender: teacherDemo._id,
    chat: adminDirectChat._id,
    readBy: [mainAdmin._id],
    createdAt: new Date(Date.now() - 1 * 3600 * 1000),
  });

  adminDirectChat.latestMessage = adminMsg2._id;
  await adminDirectChat.save();

  // Direct Chat: Teacher & Student
  const teacherStudentDirectChat = await Chat.create({
    chatName: "إرشاد أكاديمي - مشروع التخرج والمعمارية البرمجية",
    isGroupChat: false,
    university: university._id,
    users: [teacherDemo._id, studentDemo._id],
  });

  const tsMsg1 = await Message.create({
    content: "السلام عليكم دكتور فهد، أود الاستفسار عن إمكانية حجز موعد خلال الساعات المكتبية لمناقشة مقترح المشروع.",
    sender: studentDemo._id,
    chat: teacherStudentDirectChat._id,
    readBy: [teacherDemo._id],
    createdAt: new Date(Date.now() - 18 * 3600 * 1000),
  });

  const tsMsg2 = await Message.create({
    content: "أهلاً عبدالله، موعدي المكتبي يوم الثلاثاء الساعة 11:00 صباحاً متاح لك. أحضر معك مخطط النظام الأولي.",
    sender: teacherDemo._id,
    chat: teacherStudentDirectChat._id,
    readBy: [studentDemo._id],
    createdAt: new Date(Date.now() - 14 * 3600 * 1000),
  });

  teacherStudentDirectChat.latestMessage = tsMsg2._id;
  await teacherStudentDirectChat.save();

  // 17. Real-Time Performance Metrics
  console.log("📈 [Seed] Generating Real-Time Server Performance Metrics...");
  const metricsDocs = [];
  const now = Date.now();
  for (let i = 24; i >= 0; i--) {
    const timestamp = new Date(now - i * 60 * 60 * 1000);
    const cpuBase = 22 + Math.sin(i / 3) * 8 + (Math.random() * 4 - 2);
    const memBase = 44 + Math.cos(i / 4) * 6 + (Math.random() * 3 - 1.5);

    metricsDocs.push({
      timestamp,
      cpuUsage: Math.round(cpuBase * 10) / 10,
      memoryUsage: {
        total: 16384,
        used: Math.round((memBase / 100) * 16384),
        percent: Math.round(memBase * 10) / 10,
      },
      diskUsage: {
        total: 512000,
        used: 148000,
        percent: 28.9,
      },
      networkUsage: {
        incoming: Math.round(240 + Math.random() * 120),
        outgoing: Math.round(180 + Math.random() * 90),
      },
      uptime: 3600 * (48 - i),
    });
  }
  await PerformanceMetric.insertMany(metricsDocs);

  // 18. Audit Logs for Login Activity
  console.log("🔒 [Seed] Generating Audit Logs for Login Analytics...");
  const auditDocs = [];
  for (let day = 6; day >= 0; day--) {
    const logCount = 20 + Math.floor(Math.random() * 25);
    for (let j = 0; j < logCount; j++) {
      const timestamp = new Date(now - day * 24 * 3600 * 1000 + Math.random() * 24 * 3600 * 1000);
      auditDocs.push({
        userId: mainAdmin._id,
        action: "LOGIN",
        details: { ip: "192.168.1.1", userAgent: "Mozilla/5.0" },
        timestamp,
      });
    }
  }
  await AuditLog.insertMany(auditDocs);

  console.log("✨ [Seed] Full Gahbaz Demo Data Successfully Generated!");
  console.log("======================================================");
  console.log("🔑 Demo Credentials:");
  console.log("   • Admin:   admin@test.com   / admin@test.com");
  console.log("   • Teacher: teacher@tech.com / teacher@tech.com");
  console.log("   • Student: student@test.com / student@test.com");
  console.log("======================================================");

  if (import.meta.url === `file:///${process.argv[1]?.replace(/\\/g, "/")}`) {
    await mongoose.connection.close();
  }
};

if (process.argv[1] && import.meta.url.includes(process.argv[1].replace(/\\/g, "/"))) {
  seedFullDemoData().catch((err) => {
    console.error("❌ [Seed Error]", err);
    process.exit(1);
  });
}
