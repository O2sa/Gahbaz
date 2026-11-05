import { Request, Response } from "express";
import * as svc from "./universities.service.js";
import User from "../../models/User.js";

export const provisionUniversity = async (req: Request, res: Response): Promise<void> => {
  const result = await svc.provisionUniversityService(req.body);
  res.status(201).json({
    success: true,
    ...result,
  });
};

export const getUniversities = async (req: Request, res: Response): Promise<void> => {
  const result = await svc.getUniversitiesService(req.query as any);
  res.status(200).json({
    success: true,
    ...result,
  });
};

export const getUniversity = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id as string;
  const university = await svc.getUniversityByIdService(id);
  res.status(200).json({
    success: true,
    university,
  });
};

export const updateUniversity = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id as string;
  const university = await svc.updateUniversityService(id, req.body);
  res.status(200).json({
    success: true,
    university,
  });
};

export const getMyUniversity = async (req: Request, res: Response): Promise<void> => {
  let universityId = req.user?.universityId;
  if (!universityId && req.user?.userId) {
    const user = await User.findById(req.user.userId).select("university");
    universityId = user?.university ? String(user.university) : undefined;
  }
  if (!universityId) {
    res.status(404).json({ success: false, message: "No university associated with user" });
    return;
  }
  const university = await svc.getUniversityByIdService(universityId);
  res.status(200).json({
    success: true,
    university,
  });
};

export const updateMyUniversity = async (req: Request, res: Response): Promise<void> => {
  let universityId = req.user?.universityId;
  if (!universityId && req.user?.userId) {
    const user = await User.findById(req.user.userId).select("university");
    universityId = user?.university ? String(user.university) : undefined;
  }
  if (!universityId) {
    res.status(404).json({ success: false, message: "No university associated with user" });
    return;
  }
  const university = await svc.updateMyUniversityService(universityId, req.body);
  res.status(200).json({
    success: true,
    university,
  });
};
