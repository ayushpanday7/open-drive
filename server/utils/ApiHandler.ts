import { NextFunction, Request, Response } from "express";
import { INTERNAL_SERVER_ERROR_OBJECT } from "server/constants";

export function ApiHandler(
  Controller: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<{ status: number; message: string; data?: any }>
) {
  return async (req: any, res: any, next: any) => {
    try {
      const { status, message, data } = await Controller(req, res, next);
      return res.status(status).json({ message, data });
    } catch (error) {
      console.error(error);
      return res.status(500).json(INTERNAL_SERVER_ERROR_OBJECT);
    }
  };
}
