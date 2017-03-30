import { Report } from '../../models/report';
import { Response } from '@angular/http';

export class ReportFactory {
  public static buildFromJSON(response: Response) {
    let report: Report = new Report();
    console.log(response);
    return report;
  }
}
