import { BasesRepository } from "../../repository/BasesRepository";
import { BaseEntity } from "../../entity/BaseEntity";

export class PostBasesUseCase {
  constructor(private repository: BasesRepository) {}

  async exec(item: Record<string, any>): Promise<void> {
    await this.repository.put(new BaseEntity(item));
  }
}
