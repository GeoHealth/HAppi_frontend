import { Symptom } from './symptom';
import { User } from './user';

export class Report {
  private _symptoms: Symptom[];
  private _user: User;
  private _end_date: Date;
  private _start_date: Date;

  get user(): User {
    return this._user;
  }

  set user(value: User) {
    this._user = value;
  }

  get symptoms(): Symptom[] {
    return this._symptoms;
  }

  set symptoms(value: Symptom[]) {
    this._symptoms = value;
  }

  get start_date(): Date {
    return this._start_date;
  }

  set start_date(value: Date) {
    this._start_date = value;
  }
  get end_date(): Date {
    return this._end_date;
  }

  set end_date(value: Date) {
    this._end_date = value;
  }
}
