import { NextFunction, Request, Response } from "express";

export function ResponseMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (res.locals.objeto) {
    res.status(200);
  } else {
    res.status(400);
  }

  next();
}
