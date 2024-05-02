import { Database } from "./Database";
import { FlightEntity } from "../entity/FlightEntity";

export class FlightsRepository extends Database<FlightEntity> {
  constructor() {
    super();
    this.tableName = "flights-" + process.env.STAGE;
  }

  async getAll(): Promise<FlightEntity[]> {
    const data = await this.scan().execute();
    return data || [];
  }

  async put(entity: FlightEntity): Promise<void> {
    await this.putItem(entity).execute();
  }
}
