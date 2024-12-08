import { Response } from "express";

export function SendResponse(
  res: Response,
  status: number,
  message: string,
  data: any
) {
  res.status(status).json({ message, data });
}
