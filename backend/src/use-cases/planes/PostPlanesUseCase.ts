import { PlanesRepository } from "../../repository/PlanesRepository";
import { PlaneEntity } from "../../entity/PlaneEntity";

export class PostPlanesUseCase {
  constructor(private repository: PlanesRepository) {}

  async exec(item: Record<string, any>): Promise<void> {
    await this.repository.put(new PlaneEntity(item));
  }
}
