export class BaseEntity {
  constructor(data: Partial<BaseEntity>) {
    Object.assign(this, data);
  }

  id: string;

  valid(): boolean {
    return !!this.id;
  }
}
