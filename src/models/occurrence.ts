import { GPSCoordinates } from './gps_coordinates';
import { FactorInstance } from './factor_instance';

export class Occurrence {
  private _date: Date;
  private _coordinates: GPSCoordinates;
  private _factorsInstances: FactorInstance[];

  get factorsInstances(): FactorInstance[] {
    return this._factorsInstances;
  }

  set factorsInstances(value: FactorInstance[]) {
    this._factorsInstances = value;
  }

  get coordinates(): GPSCoordinates {
    return this._coordinates;
  }

  set coordinates(value: GPSCoordinates) {
    this._coordinates = value;
  }

  get date(): Date {
    return this._date;
  }

  set date(value: Date) {
    this._date = value;
  }
}
