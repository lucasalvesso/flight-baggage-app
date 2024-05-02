import { Database } from "./Database";
import { TicketEntity } from "../entity/TicketEntity";

export class TicketsRepository extends Database<TicketEntity> {
  constructor() {
    super();
    this.tableName = "tickets-" + process.env.STAGE;
  }

  async getAll(): Promise<TicketEntity[]> {
    const data = await this.scan().execute();
    return data || [];
  }

  async put(entity: TicketEntity): Promise<void> {
    await this.putItem(entity).execute();
  }
}
