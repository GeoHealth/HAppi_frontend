import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { BaseRestAPI } from './base_rest_api.service';
import { Report } from '../../../models/report';
import { Observable } from 'rxjs/Observable';
import { ReportFactory } from '../../factories/report_factory';

@Injectable()
export class ReportRestAPI extends BaseRestAPI {
  private static reportPath: string = 'report';

  constructor(http: Http) {
    super(http);
  }

  public getReport(token: string, email: string): Observable<Report> {
    return Observable.create((observable) => {
      let parameters = new Map();
      parameters.set('token', token);
      parameters.set('email', email);
      this.makeGET(ReportRestAPI.reportPath, parameters).subscribe((response: Response) => {
        observable.next(ReportFactory.buildFromJSON(response));
      }, (err) => {
        observable.error(err);
      }, () => {
        observable.complete();
      });
    });
  }
}
