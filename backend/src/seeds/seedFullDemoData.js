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

  const collegeMedicine = await College.create({
    name: "كلية العلوم والتقنية الطبية",
    numberOfSemesters: 10,
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

  const majorEE = await Major.create({
    name: "الهندسة الكهربائية والإلكترونية",
    college: collegeEng._id,
  });

  const majorME = await Major.create({
    name: "الهندسة الميكانيكية والأنظمة الذكية",
    college: collegeEng._id,
  });

  const majorMIS = await Major.create({
    name: "نظم المعلومات الإدارية",
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

  const teacherQarni = await Teacher.create({
    firstName: "د. محمد",
    lastName: "القرني",
    email: "m.qarni@gahbaz.edu",
    password: teacherHashedPass,
    phone: "0554455667",
    role: "teacher",
    university: university._id,
    title: "أستاذ - هندسة النظم",
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
    { firstName: "شهد", lastName: "الحارثي", email: "shahad.harthi@student.gahbaz.edu", major: majorEE._id, phone: "0548899001" },
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
    college: collegeCS._id,
    teachers: [teacherSara._id],
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
    college: collegeCS._id,
    teachers: [teacherDemo._id],
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
    college: collegeCS._id,
    teachers: [teacherSara._id],
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
    college: collegeCS._id,
    teachers: [teacherTariq._id],
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
    college: collegeCS._id,
    teachers: [teacherReem._id],
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
  const templateSE5 = await SemesterTemplate.create({
    name: "المستوى الخامس - هندسة البرمجيات",
    major: majorSE._id,
    index: 5,
    active: true,
    subjects: [subjectSE._id, subjectAlgo._id, subjectDB._id],
  });

  const templateSE6 = await SemesterTemplate.create({
    name: "المستوى السادس - هندسة البرمجيات",
    major: majorSE._id,
    index: 6,
    active: false,
    subjects: [subjectSec._id, subjectAI._id],
  });

  majorSE.semesterTemplates = [templateSE5._id, templateSE6._id];
  await majorSE.save();

  // 10. Semesters
  console.log("🗓️ [Seed] Creating Academic Semesters...");
  const currentSemester = await Semester.create({
    name: "الفصل الدراسي الأول 2026/2027",
    major: majorSE._id,
    template: templateSE5._id,
    university: university._id,
    startDate: new Date("2026-08-20"),
    endDate: new Date("2026-12-30"),
    completed: false,
    students: createdStudents.map((s) => s._id),
  });

  const pastSemester = await Semester.create({
    name: "الفصل الدراسي الثاني 2025/2026",
    major: majorSE._id,
    template: templateSE5._id,
    university: university._id,
    startDate: new Date("2026-01-15"),
    endDate: new Date("2026-06-01"),
    completed: true,
    students: createdStudents.map((s) => s._id),
  });

  majorSE.semesters = [currentSemester._id, pastSemester._id];
  await majorSE.save();

  // Update students coming semester
  for (const s of createdStudents) {
    s.semesters = [currentSemester._id];
    await s.save();
  }

  // 11. Courses (Course inherits from Subject via discriminator)
  console.log("📖 [Seed] Creating Active Courses...");
  const courseSE = await Course.create({
    name: "هندسة البرمجيات المتقدمة (SE310)",
    code: "SE310-F26",
    subtitle: "معماريات البرمجيات، أنماط التصميم وممارسات CI/CD الحديثة",
    category: "هندسة البرمجيات",
    college: collegeCS._id,
    teachers: [teacherDemo._id],
    semester: currentSemester._id,
    status: "active",
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
    status: "active",
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
    status: "active",
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
    status: "active",
    description: "دراسة تقنيات التشفير المتماثل وغير المتماثل، جدران الحماية، اكتشاف الاختراقات وتأمين خوادم وتطبيقات الويب.",
    requirements: ["أساسيات شبكات الحاسب", "مبادئ أنظمة التشغيل"],
    willLearn: [
      "تطبيق خوارزميات التشفير وإدارة المفاتيح",
      "تحديد الثغرات الأمنية الشائعة وطرق سدها",
      "حماية الشبكات السحابية من هجمات الحرمان من الخدمة DDoS",
    ],
    students: createdStudents.map((s) => ({ student: s._id })),
  });

  currentSemester.courses = [courseSE._id, courseAlgo._id, courseAI._id, courseSec._id];
  await currentSemester.save();

  // Assign courses to teacher profiles
  teacherDemo.courses = [courseSE._id];
  await teacherDemo.save();

  teacherSara.courses = [courseAlgo._id, courseAI._id];
  await teacherSara.save();

  teacherTariq.courses = [courseSec._id];
  await teacherTariq.save();

  // 12. Sections and Lessons for SE310
  console.log("📑 [Seed] Adding Syllabus Sections and Lessons...");
  const sec1 = await Section.create({
    name: "الوحدة الأولى: أسس المعمارية البرمجية",
    course: courseSE._id,
    lessons: [
      {
        name: "الدرس الأول: مقدمة في المعماريات الحديثة ومفهوم الـ Architecture Drivers",
        video: { url: "https://www.youtube.com/watch?v=sample1", duration: 1800 },
        topic: { data: "نظرة عامة على دور مهندس البرمجيات، وكيفية موازنة متطلبات الجودة (الأداء، الأمان، القابلية للتوسع).", readingTime: 15 },
      },
      {
        name: "الدرس الثاني: مبادئ SOLID وتطبيقاتها في هندسة النظم",
        video: { url: "https://www.youtube.com/watch?v=sample2", duration: 2400 },
        topic: { data: "شرح تفصيلي للمبادئ الخمسة مع أمثلة عملية بلغة TypeScript ونماذج كود نظيف.", readingTime: 20 },
      },
    ],
  });

  const sec2 = await Section.create({
    name: "الوحدة الثانية: أنماط التصميم المعمارية",
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

  const sec3 = await Section.create({
    name: "الوحدة الثالثة: جودة البرمجيات وأتمتة النشر",
    course: courseSE._id,
    lessons: [
      {
        name: "الدرس الخامس: أتمتة الاختبارات وتطبيق استراتيجية Test Pyramid",
        video: { url: "https://www.youtube.com/watch?v=sample5", duration: 2000 },
        topic: { data: "كتابة اختبارات الوحدة واختبارات التكامل لضمان استقرار النظام وموثوقية الكود.", readingTime: 20 },
      },
    ],
  });

  courseSE.sections = [sec1._id, sec2._id, sec3._id];
  await courseSE.save();

  // 13. Student Grades
  console.log("📊 [Seed] Recording Student Grades...");
  for (const s of createdStudents) {
    const isDemo = s.email === "student@test.com";
    const assignmentsVal = isDemo ? 24 : Math.floor(Math.random() * 6) + 19;
    const midtermVal = isDemo ? 24 : Math.floor(Math.random() * 6) + 19;
    const finalVal = isDemo ? 48 : Math.floor(Math.random() * 12) + 38;
    const total = assignmentsVal + midtermVal + finalVal;

    const gradeDoc = await Grade.create({
      course: courseSE._id,
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

    s.grades = [gradeDoc._id];
    await s.save();
  }

  // 14. Chat Rooms and Messages
  console.log("💬 [Seed] Creating Academic Discussion Chat Rooms...");
  const seChat = await Chat.create({
    chatName: "قاعة نقاش مقرر هندسة البرمجيات (SE310)",
    isGroupChat: true,
    groupAdmin: teacherDemo._id,
    university: university._id,
    users: [teacherDemo._id, studentDemo._id, createdStudents[1]._id, createdStudents[2]._id],
  });

  const msg1 = await Message.create({
    content: "السلام عليكم ورحمة الله وبركاته، مرحباً بكم جميعاً في مقرر هندسة البرمجيات المتقدمة. تم رفع توصيف المقرر والوحدات الأولى على المنصة.",
    sender: teacherDemo._id,
    chat: seChat._id,
    readBy: [studentDemo._id],
    createdAt: new Date(Date.now() - 48 * 3600 * 1000),
  });

  const msg2 = await Message.create({
    content: "وعليكم السلام دكتور فهد، أهلاً بك. هل تم تحديد موعد تسليم المشروع الفصلي للوحدة الأولى؟",
    sender: studentDemo._id,
    chat: seChat._id,
    readBy: [teacherDemo._id],
    createdAt: new Date(Date.now() - 24 * 3600 * 1000),
  });

  const msg3 = await Message.create({
    content: "نعم عبدالله، موعد التسليم بعد أسبوعين من الآن، وسيتم تخصيص جزء من المحاضرة القادمة للإجابة على أي استفسارات تخص المعمارية.",
    sender: teacherDemo._id,
    chat: seChat._id,
    readBy: [studentDemo._id],
    createdAt: new Date(Date.now() - 2 * 3600 * 1000),
  });

  seChat.latestMessage = msg3._id;
  await seChat.save();

  // 15. Real-Time Performance Metrics
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

  // 16. Audit Logs for Login Activity
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
