import { Factor } from './factor';

export class FactorInstance {
  private _factor: Factor;
  private _value: string;

  get value(): string {
    return this._value;
  }

  set value(value: string) {
    this._value = value;
  }

  get factor(): Factor {
    return this._factor;
  }

  set factor(value: Factor) {
    this._factor = value;
  }
}
