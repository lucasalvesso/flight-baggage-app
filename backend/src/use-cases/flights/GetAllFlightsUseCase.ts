import { FlightsRepository } from "../../repository/FlightsRepository";
import { FlightEntity } from "../../entity/FlightEntity";

export class GetAllFlightsUseCase {
  constructor(private repository: FlightsRepository) {}

  async exec(): Promise<FlightEntity[]> {
    return await this.repository.getAll();
  }
}
