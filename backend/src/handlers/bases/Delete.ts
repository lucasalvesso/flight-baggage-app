import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult["body"]> => {
  const data = "Route";
  return JSON.stringify(data);
};
