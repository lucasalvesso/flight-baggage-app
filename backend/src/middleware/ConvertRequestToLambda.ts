import { APIGatewayProxyEvent } from "aws-lambda";
import { NextFunction, Request, Response } from "express";

export function ConvertRequestToLambda(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  req.event = {
    path: req.path,
    headers: req.headers,
    body: req.body,
    pathParameters: req.params,
    queryStringParameters: req.query,
  } as APIGatewayProxyEvent;

  next();
}
