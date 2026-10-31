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
  if (!payload.name) {
    payload.name = `Semester ${payload.index || 1}`;
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
    return getSemesterTemplatesService({ major: id }, query);
  }

  const template = await SemesterTemplate.findById(id).populate("subjects");
  if (template) {
    return template;
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
  const template = await SemesterTemplate.findByIdAndUpdate(id, data, { new: true });
  if (!template) throw new NotFoundError("Semester template not found");
  return template;
};

export const deleteSemesterTemplateService = async (id: string) => {
  const template = await SemesterTemplate.findByIdAndDelete(id);
  if (!template) throw new NotFoundError("Semester template not found");
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

export const startSemesterService = async (
  { semesterData, semesters = [], majors = [] }: StartSemesterParams,
  universityId?: string
) => {
  const session = await mongoose.startSession();
  try {
    let result = { success: true };
    await session.withTransaction(async () => {
      let usedStudents: Types.ObjectId[] = [];
      const resolvedConfigs: { templateId: string; customSubjects: string[] | null }[] = [];

      // 1. Process `majors` array if provided
      if (Array.isArray(majors) && majors.length > 0) {
        for (const m of majors) {
          if (m.allSemesters) {
            const allTemplates = await SemesterTemplate.find({ major: m.majorId }).session(session);
            for (const t of allTemplates) {
              resolvedConfigs.push({
                templateId: String((t as any)._id),
                customSubjects: null, // default to all template subjects
              });
            }
          } else if (Array.isArray(m.semesters)) {
            for (const semItem of m.semesters) {
              const tId = semItem.templateId || semItem._id || semItem.id || semItem;
              if (tId) {
                resolvedConfigs.push({
                  templateId: tId.toString(),
                  customSubjects: Array.isArray(semItem.subjects) ? semItem.subjects : null,
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
            });
          } else if (s && typeof s === "object") {
            const tId = s.templateId || s._id || s.id;
            if (tId) {
              resolvedConfigs.push({
                templateId: tId.toString(),
                customSubjects: Array.isArray(s.subjects) ? s.subjects : null,
              });
            }
          }
        }
      }

      // De-duplicate by templateId
      const uniqueConfigsMap = new Map<string, { templateId: string; customSubjects: string[] | null }>();
      for (const cfg of resolvedConfigs) {
        if (!uniqueConfigsMap.has(cfg.templateId)) {
          uniqueConfigsMap.set(cfg.templateId, cfg);
        }
      }
      const finalConfigs = Array.from(uniqueConfigsMap.values());
      const templateIds = finalConfigs.map((c) => c.templateId);

      const semesterTemplates = await SemesterTemplate.find({ _id: { $in: templateIds } }).session(session);

      if (semesterTemplates.length === 0) {
        throw new BadRequestError("لم يتم العثور على خطط أو قوالب فصول دراسية (Semester Templates) للتخصصات المحددة.");
      }

      let createdSemestersCount = 0;

      for (const template of semesterTemplates) {
        const config = uniqueConfigsMap.get(String((template as any)._id));
        const targetSubjectIds =
          config?.customSubjects && config.customSubjects.length > 0
            ? config.customSubjects
            : template.subjects;

        const students = await Student.find({
          comingSemester: template.index,
          major: template.major,
          _id: { $nin: usedStudents },
        }).session(session);

        // Safely resolve university reference
        let resolvedUnivId = universityId;
        if (!resolvedUnivId) {
          const majorDoc = await Major.findById(template.major).populate("college").session(session);
          resolvedUnivId = (majorDoc as any)?.college?.university || (majorDoc as any)?.university;
          if (!resolvedUnivId) {
            const defaultUniv = await University.findOne().session(session);
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
        await newSemester.save({ session });
        createdSemestersCount++;

        await SemesterTemplate.findByIdAndUpdate(template._id, { active: true }, { session });

        const newCourses: any[] = [];
        if (targetSubjectIds && targetSubjectIds.length > 0) {
          const subjects = await Subject.find({ _id: { $in: targetSubjectIds } }).session(session);

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
            await newCourse.save({ session });

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
              { session }
            );

            newCourses.push(newCourse);
          }
        }

        if (students.length > 0) {
          for (const student of students) {
            student.comingSemester += 1;
            student.semesters.push(newSemester._id as Types.ObjectId);
            await student.save({ session });

            for (const course of newCourses) {
              const newGrade = new Grade({
                student: student._id,
                course: course._id,
              });
              await newGrade.save({ session });
            }
          }
          usedStudents = [...usedStudents, ...students.map((s) => s._id as Types.ObjectId)];
        }

        newSemester.courses = newCourses.map((c) => c._id);
        newSemester.students = students.map((s) => s._id as Types.ObjectId);
        await newSemester.save({ session });
      }

      result = { success: true, count: createdSemestersCount } as any;
    });
    return result;
  } finally {
    await session.endSession();
  }
};
