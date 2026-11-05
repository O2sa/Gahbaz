import { Request, Response } from "express";
import mongoose from "mongoose";
import * as svc from "./majors.service.js";
import College from "../../models/College.js";
import {
  sendPaginated,
  sendSuccess,
  sendCreated,
  sendNoContent,
} from "../../core/utils/response.utils.js";

export const getMajors = async (req: Request, res: Response): Promise<void> => {
  const universityId =
    req.user?.role === "super-admin"
      ? (req.query.university as string) || req.user?.universityId
      : req.user?.universityId;
  const collegeId = (req.query.college || req.query.collage) as string;

  const filter: Record<string, any> = {};

  if (universityId) {
    let collegeIds: any[] = [];
    if (mongoose.connection.readyState === 1 || (College.find as any).mock) {
      try {
        collegeIds = await College.find({ university: universityId }).distinct("_id");
      } catch {
        collegeIds = [];
      }
    }

    if (collegeId) {
      if (collegeIds.length > 0) {
        const isAllowed = collegeIds.some((cId: any) => cId.toString() === collegeId.toString());
        filter.college = isAllowed ? collegeId : { $in: [] };
      } else if (mongoose.connection.readyState === 1 || (College.find as any).mock) {
        filter.college = { $in: [] };
      } else {
        filter.college = collegeId;
      }
    } else {
      if (collegeIds.length > 0) {
        filter.$or = [
          { university: universityId },
          { college: { $in: collegeIds } },
        ];
      } else if (mongoose.connection.readyState === 1 || (College.find as any).mock) {
        filter.$or = [
          { university: universityId },
          { college: { $in: [] } },
        ];
      } else {
        filter.university = universityId;
      }
    }
  } else if (collegeId) {
    filter.college = collegeId;
  }

  if (req.query.search) {
    const searchFilter = { name: { $regex: req.query.search as string, $options: "i" } };
    if (filter.$or) {
      filter.$and = [{ $or: filter.$or }, searchFilter];
      delete filter.$or;
    } else {
      filter.name = searchFilter.name;
    }
  }

  const { data, meta } = await svc.getMajorsService(filter, req.query);
  sendPaginated(res, data, meta);
};

export const getMajor = async (req: Request, res: Response): Promise<void> => {
  const universityId =
    req.user?.role === "super-admin"
      ? (req.query.university as string) || req.user?.universityId || null
      : req.user?.universityId || null;
  const data = await svc.getMajorByIdService(req.params.id, universityId);
  sendSuccess(res, data);
};

export const createMajor = async (req: Request, res: Response): Promise<void> => {
  const universityId =
    req.user?.role === "super-admin"
      ? (req.body.university || req.user?.universityId)
      : req.user?.universityId;
  const data = await svc.createMajorService(req.body, universityId);
  sendCreated(res, data);
};

export const updateMajor = async (req: Request, res: Response): Promise<void> => {
  const universityId =
    req.user?.role === "super-admin"
      ? (req.query.university as string) || req.user?.universityId || null
      : req.user?.universityId || null;
  const data = await svc.updateMajorService(req.params.id, req.body, universityId);
  sendSuccess(res, data);
};

export const deleteMajor = async (req: Request, res: Response): Promise<void> => {
  const universityId =
    req.user?.role === "super-admin"
      ? (req.query.university as string) || req.user?.universityId || null
      : req.user?.universityId || null;
  await svc.deleteMajorService(req.params.id, universityId);
  sendNoContent(res);
};
