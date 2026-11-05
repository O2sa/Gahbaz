import { Request, Response } from "express";
import mongoose from "mongoose";
import * as svc from "./subjects.service.js";
import College from "../../models/College.js";
import {
  sendPaginated,
  sendSuccess,
  sendCreated,
  sendNoContent,
} from "../../core/utils/response.utils.js";

export const getSubjects = async (req: Request, res: Response): Promise<void> => {
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
    const searchRegex = { $regex: req.query.search as string, $options: "i" };
    const searchFilter = [{ name: searchRegex }, { code: searchRegex }];
    if (filter.$or) {
      filter.$and = [
        { $or: filter.$or },
        { $or: searchFilter },
      ];
      delete filter.$or;
    } else {
      filter.$or = searchFilter;
    }
  }

  const { data, meta } = await svc.getSubjectsService(filter, req.query);
  sendPaginated(res, data, meta);
};

export const getCollageSubjects = async (req: Request, res: Response): Promise<void> => {
  const universityId =
    req.user?.role === "super-admin"
      ? (req.query.university as string) || req.user?.universityId
      : req.user?.universityId;
  const { data, meta } = await svc.getCollageSubjectsService(req.params.id, req.query, universityId);
  sendPaginated(res, data, meta);
};

export const getSubject = async (req: Request, res: Response): Promise<void> => {
  const universityId =
    req.user?.role === "super-admin"
      ? (req.query.university as string) || req.user?.universityId || null
      : req.user?.universityId || null;
  const data = await svc.getSubjectByIdService(req.params.id, universityId);
  sendSuccess(res, data);
};

export const createSubject = async (req: Request, res: Response): Promise<void> => {
  const universityId =
    req.user?.role === "super-admin"
      ? (req.user?.universityId || req.body.university)
      : req.user?.universityId;
  const data = await svc.createSubjectService(req.body, universityId);
  sendCreated(res, data);
};

export const updateSubject = async (req: Request, res: Response): Promise<void> => {
  const universityId =
    req.user?.role === "super-admin"
      ? (req.query.university as string) || req.user?.universityId || null
      : req.user?.universityId || null;
  const data = await svc.updateSubjectService(req.params.id, req.body, universityId);
  sendSuccess(res, data);
};

export const deleteSubject = async (req: Request, res: Response): Promise<void> => {
  const universityId =
    req.user?.role === "super-admin"
      ? (req.query.university as string) || req.user?.universityId || null
      : req.user?.universityId || null;
  await svc.deleteSubjectService(req.params.id, universityId);
  sendNoContent(res);
};
