import { Symptom } from './symptom';
import { User } from './user';

export class Report {
  private _symptoms: Symptom[];
  private _user: User;

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
}
