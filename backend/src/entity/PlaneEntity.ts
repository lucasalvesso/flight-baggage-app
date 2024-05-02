export class PlaneEntity {
  constructor(data: Partial<PlaneEntity>) {
    Object.assign(this, data);
  }

  id: string;

  valid(): boolean {
    return !!this.id;
  }
}
