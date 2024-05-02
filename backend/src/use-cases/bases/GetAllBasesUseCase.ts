import { BasesRepository } from "../../repository/BasesRepository";
import { BaseEntity } from "../../entity/BaseEntity";

export class GetAllBasesUseCase {
  constructor(private repository: BasesRepository) {}

  async exec(): Promise<BaseEntity[]> {
    return await this.repository.getAll();
  }
}
