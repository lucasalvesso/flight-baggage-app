import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { PostTicketsUseCase } from "../../use-cases/tickets/PostTicketsUseCase";
import { TicketsRepository } from "../../repository/TicketsRepository";

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult["body"]> => {
  const useCase = new PostTicketsUseCase(new TicketsRepository());
  await useCase.exec(event.body as unknown as Record<string, any>);
  return JSON.stringify({ message: "Ticket created successfully" });
};
