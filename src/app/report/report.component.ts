import {
  Component,
  OnInit
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReportRestAPI } from '../services/rest_services/report_rest_api.service';
import { Report } from '../../models/report';

@Component({
  selector: 'report',
  styles: [`
  `],
  templateUrl: `./report.component.html`
})

export class ReportComponent implements OnInit {

  constructor(private reportRestService: ReportRestAPI) {
  }

  public ngOnInit() {
    this.reportRestService.getReport('test', 'email').then((report: Report) => {
      console.log(report);
    });
  }
}
