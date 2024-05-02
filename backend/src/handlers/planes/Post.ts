import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { PostPlanesUseCase } from "../../use-cases/planes/PostPlanesUseCase";
import { PlanesRepository } from "../../repository/PlanesRepository";

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult["body"]> => {
  const useCase = new PostPlanesUseCase(new PlanesRepository());
  await useCase.exec(event.body as unknown as Record<string, any>);
  return JSON.stringify({ message: "Post created successfully" });
};
