import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { GetAllPlanesUseCase } from "../../use-cases/planes/GetAllPlanesUseCase";
import { PlanesRepository } from "../../repository/PlanesRepository";

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult["body"]> => {
  const useCase = new GetAllPlanesUseCase(new PlanesRepository());
  const data = await useCase.exec();
  return JSON.stringify(data);
};
