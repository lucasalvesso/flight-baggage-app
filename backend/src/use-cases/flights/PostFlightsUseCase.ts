import { FlightsRepository } from "../../repository/FlightsRepository";
import { FlightEntity } from "../../entity/FlightEntity";

export class PostFlightsUseCase {
  constructor(private repository: FlightsRepository) {}

  async exec(item: Record<string, any>): Promise<void> {
    await this.repository.put(new FlightEntity(item));
  }
}
