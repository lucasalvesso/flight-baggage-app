import { TicketsRepository } from "../../repository/TicketsRepository";
import { TicketEntity } from "../../entity/TicketEntity";

export class GetAllTicketsUseCase {
  constructor(private repository: TicketsRepository) {}

  async exec(): Promise<TicketEntity[]> {
    return await this.repository.getAll();
  }
}
