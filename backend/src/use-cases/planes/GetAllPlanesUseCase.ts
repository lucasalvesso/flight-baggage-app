import { PlanesRepository } from "../../repository/PlanesRepository";
import { PlaneEntity } from "../../entity/PlaneEntity";

export class GetAllPlanesUseCase {
  constructor(private repository: PlanesRepository) {}

  async exec(): Promise<PlaneEntity[]> {
    return await this.repository.getAll();
  }
}
