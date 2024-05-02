import { Database } from "./Database";
import { BaseEntity } from "../entity/BaseEntity";

export class BasesRepository extends Database<BaseEntity> {
  constructor() {
    super();
    this.tableName = "bases-" + process.env.STAGE;
  }

  async getAll(): Promise<BaseEntity[]> {
    const data = await this.scan().execute();
    return data || [];
  }

  async put(entity: BaseEntity): Promise<void> {
    await this.putItem(entity).execute();
  }
}
