import { Request, Response } from "express";
import * as svc from "./universities.service.js";

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
