import {
  Component,
  OnInit
} from '@angular/core';
import { ReportRestAPI } from '../services/rest_services/report_rest_api.service';
import { Report } from '../../models/report';

@Component({
  selector: 'report',
  styles: [`
  `],
  template: `
    <h1>Report</h1>
  `
})

export class ReportComponent implements OnInit {

  constructor(private reportRestService: ReportRestAPI) {
  }

  public ngOnInit() {
    this.reportRestService.getReport('test', 'email').subscribe((report: Report) => {
      console.log(report);
    }, (err) => {
      console.log(err);
    });
  }
}
