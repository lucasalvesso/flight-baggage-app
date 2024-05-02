export class FlightEntity {
  constructor(data: Partial<FlightEntity>) {
    Object.assign(this, data);
  }

  id: string;

  valid(): boolean {
    return !!this.id;
  }
}
