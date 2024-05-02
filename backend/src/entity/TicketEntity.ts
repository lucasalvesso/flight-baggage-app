export class TicketEntity {
  constructor(data: Partial<TicketEntity>) {
    Object.assign(this, data);
  }

  id: string;

  valid(): boolean {
    return !!this.id;
  }
}
