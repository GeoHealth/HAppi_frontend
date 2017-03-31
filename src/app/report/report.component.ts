import {
  Component,
  OnInit
} from '@angular/core';
import { ReportRestAPI } from '../services/rest_services/report_rest_api.service';
import { Report } from '../../models/report';
import { ActivatedRoute, Params } from '@angular/router';
import { Symptom } from '../../models/symptom';
import * as $ from 'jquery';

@Component({
  selector: 'report',
  styles: [`
  `],
  templateUrl: `./report.component.html`
})

export class ReportComponent implements OnInit {
  public nbOfOccurrencesPerDayGraph = {
    type: 'line',
    data: {
      labels: [],
      datasets: []
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  };
  public nbOfOccurrencesPerSymptomGraph = {
    type: 'line',
    data: {
      labels: [],
      datasets: []
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  };
  public symptomsList: Symptom[] = [];
  public selectedSymptoms: Symptom[] = [];

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
            this.buildSymptomsList(report);
            this.buildChartNumberOfOccurrencesPerSymptom(report.symptoms);
          }, (err) => {
            console.log(err);
          });
      } else {
        console.log('error, token and email are undefined');
      }
    });
  }

  public symptomClicked(symptom: Symptom) {
    $('#symptom' + symptom.id).toggleClass('active');
    if (this.selectedSymptoms.indexOf(symptom) === -1) {
      this.selectedSymptoms.push(symptom);
    } else {
      this.selectedSymptoms.splice(this.selectedSymptoms.indexOf(symptom), 1);
    }
    this.orderSelectedSymptoms();
    this.updateGraphs();
  }

  private buildChartNumberOfOccurrencesPerSymptom(symptoms: Symptom[]) {
    let chartData = {labels: [], datasets: []};
    symptoms.forEach((symptom: Symptom) => {
      chartData.labels.push(symptom.name);
    });

    let dataset = {
      label: 'Number of occurrences per symptom',
      data: []
    };
    symptoms.forEach((symptom: Symptom) => {
      dataset.data.push(symptom.occurrences.length);
    });
    chartData.datasets.push(dataset);
    this.nbOfOccurrencesPerSymptomGraph.data = chartData;
  }

  private buildSymptomsList(report: Report) {
    this.symptomsList = report.symptoms;
    this.symptomsList.forEach((symptom) => {
      this.selectedSymptoms.push(symptom);
    });
  }

  private updateGraphs() {
    this.buildChartNumberOfOccurrencesPerSymptom(this.selectedSymptoms);
  }

  private orderSelectedSymptoms() {
    this.selectedSymptoms.sort((a: Symptom, b: Symptom) => {
      return a.name > b.name ? 1 : -1;
    });
  }
}
