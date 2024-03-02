import { NextFunction, Request, Response } from "express";
import ForbiddenException from "../exceptions/forbiddenException";
import jwt from "jsonwebtoken";
import "dotenv/config";

export default function jwtHandler(
  req: Request,
  _: Response,
  next: NextFunction
) {
  const token = req.headers.authorization!.replaceAll("Bearer ", "");

  if (!token) {
    throw new ForbiddenException("Authorization token not found.");
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!, {
      issuer: process.env.ISSUER,
    });

    next();
  } catch (e) {
    console.error(e);

    if (e instanceof Error) {
      throw new ForbiddenException(e.message);
    }
  }
}
