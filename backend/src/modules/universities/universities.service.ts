import mongoose from "mongoose";
import crypto from "crypto";
import University from "../../models/University.js";
import User from "../../models/User.js";
import College from "../../models/College.js";
import Major from "../../models/Major.js";
import Course from "../../models/Course.js";
import { BadRequestError, NotFoundError } from "../../core/errors/customErrors.js";
import { hashPassword } from "../../core/utils/password.utils.js";
import {
  CreateUniversityInput,
  UpdateUniversityInput,
  UniversityQueryInput,
} from "./universities.validator.js";

export const provisionUniversityService = async (data: CreateUniversityInput) => {
  const normalizedName = data.name.trim();
  const normalizedCode = data.code.trim().toUpperCase();
  const normalizedEmail = data.adminEmail.trim().toLowerCase();

  // 1. Check duplicate university name or code
  const existingUniv = await University.findOne({
    $or: [{ name: { $regex: `^${normalizedName}$`, $options: "i" } }, { code: normalizedCode }],
  });
  if (existingUniv) {
    throw new BadRequestError("A university with this name or code already exists");
  }

  // 2. Check duplicate admin email
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new BadRequestError("Admin email already in use by another account");
  }

  // 3. Generate high-entropy temp password and hash it
  const tempPassword = `Univ@${crypto.randomBytes(4).toString("hex")}#9`;
  const hashedPassword = await hashPassword(tempPassword);

  // 4. Atomic transaction with standalone fallback
  const executeCore = async (sess?: mongoose.ClientSession) => {
    const sessionOption = sess ? { session: sess } : {};

    const university = new University({
      name: normalizedName,
      code: normalizedCode,
      active: true,
    });
    await university.save(sessionOption);

    const user = await User.create(
      [
        {
          name: data.adminName.trim(),
          email: normalizedEmail,
          password: hashedPassword,
          role: "admin",
          university: university._id,
        },
      ],
      sessionOption
    );

    university.admin = user[0]._id as any;
    await university.save(sessionOption);

    return {
      university: university.toObject ? university.toObject() : university,
      admin: {
        _id: user[0]._id,
        name: user[0].name,
        email: user[0].email,
      },
      tempPassword,
    };
  };

  let session: mongoose.ClientSession | null = null;
  try {
    session = await mongoose.startSession();
  } catch {
    return await executeCore(undefined);
  }

  try {
    let result: any;
    try {
      session.startTransaction();
      result = await executeCore(session);
      await session.commitTransaction();
    } catch (err: any) {
      try {
        await session.abortTransaction();
      } catch {
        // Ignore if already aborted
      }

      const isReplicaSetError =
        err?.code === 20 ||
        err?.codeName === "IllegalOperation" ||
        (typeof err?.message === "string" &&
          (err.message.includes("replica set") ||
            err.message.includes("Transaction numbers are only allowed")));

      if (isReplicaSetError) {
        // Fallback: standalone MongoDB does not support multi-document transactions
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

export const getUniversitiesService = async (query: UniversityQueryInput) => {
  const filter: any = {};

  if (query.search) {
    const s = query.search.trim();
    filter.$or = [
      { name: { $regex: s, $options: "i" } },
      { code: { $regex: s, $options: "i" } },
    ];
  }

  if (query.active !== undefined) {
    filter.active = query.active === "true";
  }

  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = (page - 1) * limit;

  const totalCount = await University.countDocuments(filter);
  const universities = await University.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("admin", "name email")
    .lean();

  // Populate telemetry counts for each university
  const universitiesWithTelemetry = await Promise.all(
    universities.map(async (univ: any) => {
      const [collegesCount, majorsCount, coursesCount, studentsCount, teachersCount] =
        await Promise.all([
          College.countDocuments({ university: univ._id }),
          Major.countDocuments({ university: univ._id }),
          Course.countDocuments({ university: univ._id }),
          User.countDocuments({ university: univ._id, role: "student" }),
          User.countDocuments({ university: univ._id, role: "teacher" }),
        ]);

      return {
        ...univ,
        telemetry: {
          collegesCount,
          majorsCount,
          coursesCount,
          studentsCount,
          teachersCount,
        },
      };
    })
  );

  return {
    universities: universitiesWithTelemetry,
    meta: {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit) || 1,
    },
  };
};

export const getUniversityByIdService = async (id: string) => {
  const university: any = await University.findById(id)
    .populate("admin", "name email")
    .lean();

  if (!university) {
    throw new NotFoundError("University not found");
  }

  const [collegesCount, majorsCount, coursesCount, studentsCount, teachersCount] =
    await Promise.all([
      College.countDocuments({ university: university._id }),
      Major.countDocuments({ university: university._id }),
      Course.countDocuments({ university: university._id }),
      User.countDocuments({ university: university._id, role: "student" }),
      User.countDocuments({ university: university._id, role: "teacher" }),
    ]);

  return {
    ...university,
    telemetry: {
      collegesCount,
      majorsCount,
      coursesCount,
      studentsCount,
      teachersCount,
    },
  };
};

export const updateUniversityService = async (id: string, data: UpdateUniversityInput) => {
  const university = await University.findById(id);
  if (!university) {
    throw new NotFoundError("University not found");
  }

  if (data.name && data.name.trim() !== university.name) {
    const exists = await University.findOne({
      name: { $regex: `^${data.name.trim()}$`, $options: "i" },
      _id: { $ne: id },
    });
    if (exists) {
      throw new BadRequestError("A university with this name already exists");
    }
  }

  if (data.code && data.code.trim().toUpperCase() !== university.code) {
    const exists = await University.findOne({
      code: data.code.trim().toUpperCase(),
      _id: { $ne: id },
    });
    if (exists) {
      throw new BadRequestError("A university with this code already exists");
    }
  }

  const updatePayload: any = {};
  if (data.name) updatePayload.name = data.name.trim();
  if (data.code) updatePayload.code = data.code.trim().toUpperCase();
  if (data.active !== undefined) updatePayload.active = data.active;

  const updated = await University.findByIdAndUpdate(id, updatePayload, {
    new: true,
    runValidators: true,
  })
    .populate("admin", "name email")
    .lean();

  return updated;
};
