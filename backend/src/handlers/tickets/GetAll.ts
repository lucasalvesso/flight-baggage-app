import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { GetAllTicketsUseCase } from "../../use-cases/tickets/GetAllTicketsUseCase";
import { TicketsRepository } from "../../repository/TicketsRepository";

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult["body"]> => {
  const useCase = new GetAllTicketsUseCase(new TicketsRepository());
  const data = await useCase.exec();
  return JSON.stringify(data);
};
