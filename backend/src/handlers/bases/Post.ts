import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { BasesRepository } from "../../repository/BasesRepository";
import { PostBasesUseCase } from "../../use-cases/bases/PostBasesUseCase";

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult["body"]> => {
  const useCase = new PostBasesUseCase(new BasesRepository());
  await useCase.exec(event.body as unknown as Record<string, any>);
  return JSON.stringify({ message: "Base created successfully" });
};
