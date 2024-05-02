import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { PostFlightsUseCase } from "../../use-cases/flights/PostFlightsUseCase";
import { FlightsRepository } from "../../repository/FlightsRepository";

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult["body"]> => {
  const useCase = new PostFlightsUseCase(new FlightsRepository());
  await useCase.exec(event.body as unknown as Record<string, any>);
  return JSON.stringify({ message: "Plane created successfully" });
};
