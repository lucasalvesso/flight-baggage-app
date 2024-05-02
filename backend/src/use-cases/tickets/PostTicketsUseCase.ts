import { TicketsRepository } from "../../repository/TicketsRepository";
import { TicketEntity } from "../../entity/TicketEntity";

export class PostTicketsUseCase {
  constructor(private repository: TicketsRepository) {}

  async exec(item: Record<string, any>): Promise<void> {
    await this.repository.put(new TicketEntity(item));
  }
}
