import { Response } from "express";

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  meta?: any;
}

export const sendSuccess = <T = any>(
  res: Response,
  data: T = {} as T,
  statusCode: number = 200,
  meta: any = null
): Response => {
  const payload: ApiResponse<T> = {
    success: true,
    data,
  };
  if (meta) {
    payload.meta = meta;
  }
  return res.status(statusCode).json(payload);
};

export const sendCreated = <T = any>(res: Response, data: T = {} as T): Response => {
  return sendSuccess(res, data, 201);
};

export const sendNoContent = (res: Response): Response => {
  return res.status(204).send();
};

export const sendPaginated = <T = any>(
  res: Response,
  data: T[] = [],
  meta: any = {}
): Response => {
  return sendSuccess(res, data, 200, meta);
};
