import { Occurrence } from './occurrence';

export class Symptom {
  private _name: string;
  private _shortDescription: string;
  private _longDescription: string;
  private _genderFilter: string;
  private _occurrences: Occurrence[];

  get genderFilter(): string {
    return this._genderFilter;
  }

  set genderFilter(value: string) {
    this._genderFilter = value;
  }

  get longDescription(): string {
    return this._longDescription;
  }

  set longDescription(value: string) {
    this._longDescription = value;
  }

  get shortDescription(): string {
    return this._shortDescription;
  }

  set shortDescription(value: string) {
    this._shortDescription = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get occurrences(): Occurrence[] {
    return this._occurrences;
  }

  set occurrences(value: Occurrence[]) {
    this._occurrences = value;
  }
}
