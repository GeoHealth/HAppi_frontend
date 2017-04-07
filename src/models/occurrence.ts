import { GPSCoordinates } from './gps_coordinates';
import { FactorInstance } from './factor_instance';

export class Occurrence {
  private _date: Date;
  private _gps_coordinate: GPSCoordinates;
  private _factor_instances: FactorInstance[];

  get factor_instances(): FactorInstance[] {
    return this._factor_instances;
  }

  set factor_instances(value: FactorInstance[]) {
    this._factor_instances = value;
  }

  get gps_coordinate(): GPSCoordinates {
    return this._gps_coordinate;
  }

  set gps_coordinate(value: GPSCoordinates) {
    this._gps_coordinate = value;
  }

  get date(): Date {
    return this._date;
  }

  set date(value: Date) {
    this._date = value;
  }
}
