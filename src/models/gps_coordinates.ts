export class GPSCoordinates {
  private _accuracy: number;
  private _altitude: number;
  private _altitudeAccuracy: number;
  private _heading: number;
  private _speed: number;
  private _latitude: number;
  private _longitude: number;

  get longitude(): number {
    return this._longitude;
  }

  set longitude(value: number) {
    this._longitude = value;
  }

  get latitude(): number {
    return this._latitude;
  }

  set latitude(value: number) {
    this._latitude = value;
  }

  get speed(): number {
    return this._speed;
  }

  get heading(): number {
    return this._heading;
  }

  set heading(value: number) {
    this._heading = value;
  }

  get altitudeAccuracy(): number {
    return this._altitudeAccuracy;
  }

  set altitudeAccuracy(value: number) {
    this._altitudeAccuracy = value;
  }

  get altitude(): number {
    return this._altitude;
  }

  set altitude(value: number) {
    this._altitude = value;
  }

  get accuracy(): number {
    return this._accuracy;
  }

  set accuracy(value: number) {
    this._accuracy = value;
  }
}
