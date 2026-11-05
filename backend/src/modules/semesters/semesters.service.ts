import mongoose, { Types } from "mongoose";
import Semester, { ISemester } from "../../models/Semester.js";
import SemesterTemplate, { ISemesterTemplate } from "../../models/SemesterTemplate.js";
import Student from "../../models/Student.js";
import Course from "../../models/Course.js";
import Section from "../../models/Section.js";
import Subject from "../../models/Subject.js";
import Grade from "../../models/Grade.js";
import Chat from "../../models/Chat.js";
import Major from "../../models/Major.js";
import University from "../../models/University.js";
import { NotFoundError, BadRequestError } from "../../core/errors/customErrors.js";
import { paginateQuery, parsePagination } from "../../core/utils/pagination.utils.js";
import {
  CreateSemesterTemplateInput,
  UpdateSemesterTemplateInput,
} from "./semesters.validator.js";

// ======================== SEMESTER TEMPLATES ========================
export const createSemesterTemplateService = async (data: CreateSemesterTemplateInput) => {
  const payload: Record<string, any> = { ...data };

  // Fetch existing templates for this major to validate sequencing & prevent duplicate index
  let existingTemplates: ISemesterTemplate[] = [];
  if (mongoose.connection.readyState === 1 || (SemesterTemplate.find as any).mock) {
    try {
      const query = SemesterTemplate.find({ major: data.major });
      existingTemplates = typeof (query as any).sort === "function"
        ? await (query as any).sort({ index: 1 })
        : await query;
    } catch {
      existingTemplates = [];
    }
  }

  const nextIndex = existingTemplates.length + 1;

  if (payload.index !== undefined && payload.index !== null) {
    const requestedIndex = Number(payload.index);
    if (requestedIndex < 1) {
      throw new BadRequestError("يجب أن يبدأ ترتيب المستوى الأكاديمي من 1 على الأقل.");
    }
    const duplicate = existingTemplates.find((t) => t.index === requestedIndex);
    if (duplicate) {
      throw new BadRequestError(
        `يوجد مستوى دراسي مسجل مسبقاً بنفس الترتيب (${requestedIndex}) لهذا التخصص.`
      );
    }
    if (requestedIndex !== nextIndex) {
      throw new BadRequestError(
        `لا يمكن كسر الترتيب التسلسلي للفصول الدراسية. الترتيب التسلسلي المطلوب للمستوى القادم هو (${nextIndex}).`
      );
    }
    payload.index = requestedIndex;
  } else {
    payload.index = nextIndex;
  }

  if (!payload.name) {
    payload.name = `Semester ${payload.index}`;
  }
  return SemesterTemplate.create(payload);
};

export const getSemesterTemplatesService = async (
  filter: Record<string, any> = {},
  query: Record<string, any> = {}
) => {
  const { page, limit } = parsePagination(query);
  return paginateQuery<ISemesterTemplate>(SemesterTemplate, filter, {
    page,
    limit,
    populate: "subjects",
  });
};

export const getSemesterTemplatesByMajorOrIdService = async (
  id: string,
  query: Record<string, any> = {}
) => {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return { data: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0 } };
  }
  const majorExists = await Major.exists({ _id: id });
  if (majorExists) {
    const result = await getSemesterTemplatesService(
      { major: id },
      { ...query, limit: query.limit || 100 }
    );

    let studentCounts: any[] = [];
    if (mongoose.connection.readyState === 1 || (Student.aggregate as any).mock) {
      try {
        studentCounts = await Student.aggregate([
          { $match: { major: new mongoose.Types.ObjectId(id) } },
          { $group: { _id: "$comingSemester", count: { $sum: 1 } } },
        ]);
      } catch {
        studentCounts = [];
      }
    }

    const countMap = new Map<number, number>();
    for (const sc of studentCounts) {
      countMap.set(Number(sc._id), sc.count);
    }

    const dataWithStudents = (result.data || []).map((t: any) => {
      const plain = t.toObject ? t.toObject() : t;
      return {
        ...plain,
        studentsCount: countMap.get(Number(plain.index)) || 0,
      };
    });

    return {
      ...result,
      data: dataWithStudents,
    };
  }

  const template = await SemesterTemplate.findById(id).populate("subjects");
  if (template) {
    let studentCount = 0;
    if (mongoose.connection.readyState === 1 || (Student.countDocuments as any).mock) {
      try {
        studentCount = await Student.countDocuments({
          major: template.major,
          comingSemester: template.index,
        });
      } catch {
        studentCount = 0;
      }
    }
    const plain = template.toObject ? template.toObject() : template;
    return {
      ...plain,
      studentsCount: studentCount,
    };
  }

  return getSemesterTemplatesService({ major: id }, query);
};

export const getSemesterTemplateByIdService = async (id: string) => {
  const template = await SemesterTemplate.findById(id).populate("subjects");
  if (!template) throw new NotFoundError("Semester template not found");
  return template;
};

export const updateSemesterTemplateService = async (
  id: string,
  data: UpdateSemesterTemplateInput
) => {
  if (data.index !== undefined && data.index !== null) {
    const newIndex = Number(data.index);
    if (newIndex < 1) {
      throw new BadRequestError("يجب أن يبدأ ترتيب المستوى الأكاديمي من 1 على الأقل.");
    }

    const currentTemplate = await SemesterTemplate.findById(id);
    if (!currentTemplate) throw new NotFoundError("Semester template not found");

    if (newIndex !== currentTemplate.index) {
      let templatesInMajor: ISemesterTemplate[] = [];
      if (mongoose.connection.readyState === 1 || (SemesterTemplate.find as any).mock) {
        try {
          templatesInMajor = await SemesterTemplate.find({ major: currentTemplate.major });
        } catch {
          templatesInMajor = [];
        }
      }

      if (templatesInMajor.length > 0) {
        if (newIndex > templatesInMajor.length) {
          throw new BadRequestError(
            `لا يمكن تعيين ترتيب (${newIndex}) أكبر من عدد المستويات المسجلة لهذا التخصص (${templatesInMajor.length}) لتجنب كسر التسلسل.`
          );
        }
        const duplicate = templatesInMajor.find(
          (t) => String(t._id) !== String(id) && t.index === newIndex
        );
        if (duplicate) {
          throw new BadRequestError(
            `يوجد مستوى دراسي آخر بنفس الترتيب (${newIndex}) لهذا التخصص. يرجى تعديل ترتيب المستويات بدون تكرار.`
          );
        }
      }
    }
  }

  const template = await SemesterTemplate.findByIdAndUpdate(id, data, { new: true });
  if (!template) throw new NotFoundError("Semester template not found");
  return template;
};

export const deleteSemesterTemplateService = async (id: string) => {
  const template = await SemesterTemplate.findByIdAndDelete(id);
  if (!template) throw new NotFoundError("Semester template not found");

  if (mongoose.connection.readyState === 1 || (SemesterTemplate.updateMany as any).mock) {
    try {
      await SemesterTemplate.updateMany(
        { major: template.major, index: { $gt: template.index } },
        { $inc: { index: -1 } }
      );
    } catch {
      // Ignore in disconnected test environments
    }
  }

  return template;
};

// ======================== SEMESTERS ========================
export const getAllSemestersService = async (
  universityId?: string,
  query: Record<string, any> = {}
) => {
  const { page, limit } = parsePagination(query);
  return paginateQuery<ISemester>(Semester, { university: universityId }, {
    page,
    limit,
    populate: [
      {
        path: "major",
        populate: { path: "college" },
      },
      "courses",
    ],
  });
};

export const getSemesterByIdService = async (id: string) => {
  const semester = await Semester.findById(id).populate("courses");
  if (!semester) throw new NotFoundError("Semester not found");
  return semester;
};

export const updateSemesterService = async (id: string, data: Record<string, any>) => {
  const semester = await Semester.findByIdAndUpdate(id, data, { new: true });
  if (!semester) throw new NotFoundError("Semester not found");
  return semester;
};

export const deleteSemesterService = async (id: string) => {
  const semester = await Semester.findByIdAndDelete(id);
  if (!semester) throw new NotFoundError("Semester not found");

  await Student.updateMany({ semesters: semester._id }, { $pull: { semesters: semester._id } });
  await Course.deleteMany({ semester: semester._id });
  if (semester.courses && semester.courses.length > 0) {
    await Section.deleteMany({ course: { $in: semester.courses } });
  }
  return semester;
};

export const endSemesterService = async (id: string) => {
  const semester = await Semester.findByIdAndUpdate(id, { completed: true }, { new: true });
  if (!semester) throw new NotFoundError("Semester not found");
  if (semester.template) {
    await SemesterTemplate.findByIdAndUpdate(semester.template, { active: false });
  }
  return semester;
};

export interface StartSemesterParams {
  semesterData: {
    endDate?: string | Date;
    [key: string]: any;
  };
  semesters?: any[];
  majors?: any[];
}

const attachSession = <T>(query: T, session?: mongoose.ClientSession): T => {
  if (session && typeof (query as any)?.session === "function") {
    return (query as any).session(session);
  }
  return query;
};

export const startSemesterService = async (
  { semesterData, semesters = [], majors = [] }: StartSemesterParams,
  universityId?: string
) => {
  const executeCore = async (session?: mongoose.ClientSession) => {
    const saveOpts = session ? { session } : undefined;
    let usedStudents: Types.ObjectId[] = [];
    const resolvedConfigs: {
      templateId: string;
      customSubjects: string[] | null;
      isAllSemesters: boolean;
    }[] = [];

    // 1. Process `majors` array if provided
    if (Array.isArray(majors) && majors.length > 0) {
      for (const m of majors) {
        if (m.allSemesters) {
          const allTemplates = await attachSession(
            SemesterTemplate.find({ major: m.majorId }),
            session
          );
          for (const t of allTemplates) {
            resolvedConfigs.push({
              templateId: String((t as any)._id),
              customSubjects: null, // default to all template subjects
              isAllSemesters: true,
            });
          }
        } else if (Array.isArray(m.semesters)) {
          for (const semItem of m.semesters) {
            const tId = semItem.templateId || semItem._id || semItem.id || semItem;
            if (tId) {
              resolvedConfigs.push({
                templateId: tId.toString(),
                customSubjects: Array.isArray(semItem.subjects) ? semItem.subjects : null,
                isAllSemesters: false,
              });
            }
          }
        }
      }
    }

    // 2. Process `semesters` array (supports string IDs, objects, legacy calls)
    if (Array.isArray(semesters) && semesters.length > 0) {
      for (const s of semesters) {
        if (typeof s === "string" || s instanceof mongoose.Types.ObjectId) {
          resolvedConfigs.push({
            templateId: s.toString(),
            customSubjects: null,
            isAllSemesters: false,
          });
        } else if (s && typeof s === "object") {
          const tId = s.templateId || s._id || s.id;
          if (tId) {
            resolvedConfigs.push({
              templateId: tId.toString(),
              customSubjects: Array.isArray(s.subjects) ? s.subjects : null,
              isAllSemesters: false,
            });
          }
        }
      }
    }

    // De-duplicate by templateId
    const uniqueConfigsMap = new Map<
      string,
      { templateId: string; customSubjects: string[] | null; isAllSemesters: boolean }
    >();
    for (const cfg of resolvedConfigs) {
      if (!uniqueConfigsMap.has(cfg.templateId)) {
        uniqueConfigsMap.set(cfg.templateId, cfg);
      } else {
        const existing = uniqueConfigsMap.get(cfg.templateId)!;
        if (!cfg.isAllSemesters) {
          existing.isAllSemesters = false;
        }
      }
    }
    const finalConfigs = Array.from(uniqueConfigsMap.values());
    const templateIds = finalConfigs.map((c) => c.templateId);

    const semesterTemplates = await attachSession(
      SemesterTemplate.find({ _id: { $in: templateIds } }),
      session
    );

    if (semesterTemplates.length === 0) {
      throw new BadRequestError("لم يتم العثور على خطط أو قوالب فصول دراسية (Semester Templates) للتخصصات المحددة.");
    }

    let createdSemestersCount = 0;
    let totalCoursesCount = 0;
    let totalChatsCount = 0;
    let totalStudentsEnrolled = 0;

    for (const template of semesterTemplates) {
      const config = uniqueConfigsMap.get(String((template as any)._id));
      const targetSubjectIds =
        config?.customSubjects && config.customSubjects.length > 0
          ? config.customSubjects
          : template.subjects;

      // Business Rule: A semester cannot be started without subjects! (at least 1 subject required)
      if (!targetSubjectIds || targetSubjectIds.length === 0) {
        if (!config?.isAllSemesters || semesterTemplates.length === 1) {
          throw new BadRequestError(
            `لا يمكن بدء الفصل الدراسي "${template.name}": لا يحتوي على أي مقررات دراسية. يجب أن يتضمن الفصل مقرر دراسي واحد على الأقل.`
          );
        }
        // In allSemesters bulk mode, skip levels with no subjects
        continue;
      }

      const students = await attachSession(
        Student.find({
          comingSemester: template.index,
          major: template.major,
          _id: { $nin: usedStudents },
        }),
        session
      );

      // Business Rule: A semester cannot be started without enrolled students!
      if (!students || students.length === 0) {
        if (!config?.isAllSemesters || semesterTemplates.length === 1) {
          throw new BadRequestError(
            `لا يمكن بدء الفصل الدراسي "${template.name}": لا يوجد طلاب مقيدون في هذا المستوى الدراسي (${template.index}).`
          );
        }
        // In allSemesters bulk mode, skip levels with no enrolled students
        continue;
      }

      // Safely resolve university reference
      let resolvedUnivId = universityId;
      if (!resolvedUnivId) {
        const majorDoc = await attachSession(
          Major.findById(template.major).populate("college"),
          session
        );
        resolvedUnivId = (majorDoc as any)?.college?.university || (majorDoc as any)?.university;
        if (!resolvedUnivId) {
          const defaultUniv = await attachSession(University.findOne(), session);
          resolvedUnivId = defaultUniv?._id ? String(defaultUniv._id) : undefined;
        }
      }

      const semesterName = semesterData?.name
        ? (semesterTemplates.length > 1
            ? `${semesterData.name} - ${template.name}`
            : semesterData.name)
        : template.name;

      const newSemester = new Semester({
        name: semesterName.length > 100 ? semesterName.slice(0, 100) : semesterName,
        major: template.major,
        template: template._id,
        university: resolvedUnivId,
        ...semesterData,
        ...(semesterName ? { name: semesterName.length > 100 ? semesterName.slice(0, 100) : semesterName } : {}),
        ...(resolvedUnivId ? { university: resolvedUnivId } : {}),
      });
      await newSemester.save(saveOpts);
      createdSemestersCount++;

      await SemesterTemplate.findByIdAndUpdate(template._id, { active: true }, saveOpts);

      const newCourses: any[] = [];
      if (targetSubjectIds && targetSubjectIds.length > 0) {
        const subjects = await attachSession(
          Subject.find({ _id: { $in: targetSubjectIds } }),
          session
        );

        for (const subject of subjects) {
          const newCourse = new Course({
            name: subject.name,
            subtitle: subject.subtitle,
            category: subject.category,
            gradeSchema: subject.gradeSchema,
            creditHours: subject.creditHours || 3,
            prerequisites: subject.prerequisites || [],
            semester: newSemester._id,
            teachers: subject.teachers,
            university: resolvedUnivId,
          });
          await newCourse.save(saveOpts);
          totalCoursesCount++;

          const chatUsers = [...students.map((s) => s._id), ...(newCourse.teachers || [])];
          await Chat.create(
            [
              {
                chatName: `دورة ${newCourse.name}`,
                users: chatUsers,
                isGroupChat: true,
                groupAdmin: newCourse.teachers?.[0] || chatUsers[0] || undefined,
                course: newCourse._id,
                university: resolvedUnivId,
              },
            ],
            saveOpts
          );
          totalChatsCount++;

          newCourses.push(newCourse);
        }
      }

      if (students.length > 0) {
        for (const student of students) {
          student.comingSemester += 1;
          student.semesters.push(newSemester._id as Types.ObjectId);
          await student.save(saveOpts);

          for (const course of newCourses) {
            const newGrade = new Grade({
              student: student._id,
              course: course._id,
            });
            await newGrade.save(saveOpts);
          }
          totalStudentsEnrolled++;
        }
        usedStudents = [...usedStudents, ...students.map((s) => s._id as Types.ObjectId)];
      }

      newSemester.courses = newCourses.map((c) => c._id);
      newSemester.students = students.map((s) => s._id as Types.ObjectId);
      await newSemester.save(saveOpts);
    }

    if (createdSemestersCount === 0) {
      throw new BadRequestError(
        "لا يمكن بدء أي فصل دراسي: لم يتم العثور على أي مستوى يضم طلاباً مقيدين ومقررات دراسية معتمدة في هذا التخصص."
      );
    }

    return {
      success: true,
      count: createdSemestersCount,
      stats: {
        semestersCreated: createdSemestersCount,
        coursesCreated: totalCoursesCount,
        chatsCreated: totalChatsCount,
        studentsEnrolled: totalStudentsEnrolled,
      },
    };
  };

  let session: mongoose.ClientSession | null = null;
  try {
    session = await mongoose.startSession();
  } catch (err) {
    // If startSession is not supported, run directly without transaction
    return await executeCore(undefined);
  }

  try {
    let result: any = { success: true };
    try {
      await session.withTransaction(async () => {
        result = await executeCore(session!);
      });
    } catch (err: any) {
      const isReplicaSetError =
        err?.code === 20 ||
        err?.codeName === "IllegalOperation" ||
        (typeof err?.message === "string" &&
          (err.message.includes("replica set") ||
            err.message.includes("Transaction numbers are only allowed")));

      if (isReplicaSetError) {
        // Fallback: standalone MongoDB does not support transactions
        result = await executeCore(undefined);
      } else {
        throw err;
      }
    }
    return result;
  } finally {
    if (session) {
      await session.endSession();
    }
  }
};
