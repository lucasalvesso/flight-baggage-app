import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { GetAllBasesUseCase } from "../../use-cases/bases/GetAllBasesUseCase";
import { BasesRepository } from "../../repository/BasesRepository";

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult["body"]> => {
  const useCase = new GetAllBasesUseCase(new BasesRepository());
  const data = await useCase.exec();
  return JSON.stringify(data);
};
