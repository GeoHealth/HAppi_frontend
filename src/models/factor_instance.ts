export class FactorInstance {
  private _value: string;
  private _factor_id: number;

  get factor_id(): number {
    return this._factor_id;
  }

  set factor_id(value: number) {
    this._factor_id = value;
  }

  get value(): string {
    return this._value;
  }

  set value(value: string) {
    this._value = value;
  }
}
