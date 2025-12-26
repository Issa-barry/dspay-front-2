export class Devise {
  id?: number;
  nom?: string;
  tag?: string;

  constructor(data?: Partial<Devise>) {
    if (data) Object.assign(this, data);
  }
}
