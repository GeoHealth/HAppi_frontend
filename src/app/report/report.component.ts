import {
  Component,
  OnInit
} from '@angular/core';
import { ReportRestAPI } from '../services/rest_services/report_rest_api.service';
import { Report } from '../../models/report';
import { ActivatedRoute, Params } from '@angular/router';
import { Symptom } from '../../models/symptom';

@Component({
  selector: 'report',
  styles: [`
  `],
  templateUrl: `./report.component.html`
})

export class ReportComponent implements OnInit {
  public chartType = 'line';
  public chartData = {
    labels: [],
    datasets: []
  };
  public chartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };

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
            let chartData = {labels: [], datasets: []};
            report.symptoms.forEach((symptom: Symptom) => {
              chartData.labels.push(symptom.name);
            });

            let dataset = {
              label: 'Number of occurrences per symptom',
              data: []
            };
            report.symptoms.forEach((symptom: Symptom) => {
              dataset.data.push(symptom.occurrences.length);
            });
            chartData.datasets.push(dataset);
            this.chartData = chartData;
          }, (err) => {
            console.log(err);
          });
      } else {
        console.log('error, token and email are undefined');
      }
    });
  }
}
