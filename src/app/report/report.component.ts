import {
  Component,
  OnInit
} from '@angular/core';
import { ReportRestAPI } from '../services/rest_services/report_rest_api.service';
import { Report } from '../../models/report';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'report',
  styles: [`
  `],
  templateUrl: `./report.component.html`
})

export class ReportComponent implements OnInit {

  constructor(private reportRestService: ReportRestAPI,
              private activatedRoute: ActivatedRoute) {
  }

  public ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      let token = params['token'];
      let email = params['email'];
      if (token && email) {
        this.reportRestService.getReport(token, email)
          .subscribe((report: Report) => {
            console.log(report);
          }, (err) => {
            console.log(err);
          });
      } else {
        console.log('error, token and email are undefined');
      }
    });
  }
}
