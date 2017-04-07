import { Occurrence } from './occurrence';

export class OccurrenceWithSymptomName extends Occurrence {
  private _symptomName: string;

  get symptomName(): string {
    return this._symptomName;
  }

  set symptomName(value: string) {
    this._symptomName = value;
  }
}
