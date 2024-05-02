import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { GetAllFlightsUseCase } from "../../use-cases/flights/GetAllFlightsUseCase";
import { FlightsRepository } from "../../repository/FlightsRepository";

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult["body"]> => {
  const useCase = new GetAllFlightsUseCase(new FlightsRepository());
  const data = await useCase.exec();
  return JSON.stringify(data);
};
