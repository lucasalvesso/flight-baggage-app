import { Database } from "./Database";
import { PlaneEntity } from "../entity/PlaneEntity";

export class PlanesRepository extends Database<PlaneEntity> {
  constructor() {
    super();
    this.tableName = "planes-" + process.env.STAGE;
  }

  async getAll(): Promise<PlaneEntity[]> {
    const data = await this.scan().execute();
    return data || [];
  }

  async put(entity: PlaneEntity): Promise<void> {
    await this.putItem(entity).execute();
  }
}
