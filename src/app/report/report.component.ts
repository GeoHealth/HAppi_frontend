import {
  Component,
  OnInit
} from '@angular/core';
import { ReportRestAPI } from '../services/rest_services/report_rest_api.service';
import { Report } from '../../models/report';
import { ActivatedRoute, Params } from '@angular/router';
import { Symptom } from '../../models/symptom';
import * as $ from 'jquery';
import moment from 'moment';
import { Occurrence } from '../../models/occurrence';
import * as randomColor from 'randomcolor';

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
    type: 'bar',
    data: {
      labels: [],
      datasets: []
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  };
  public symptomsList: Symptom[] = [];
  public selectedSymptoms: Symptom[] = [];
  public symptomsColors: Map<number, string> = new Map();

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
            this.convertStringDatesToDates(report);
            this.buildSymptomsList(report);
            this.createRandomColorsForSymptom(report);
            this.buildChartNumberOfOccurrencesPerSymptom(report.symptoms);
            this.buildChartNumberOfOccurrencesPerDay(report.symptoms);
          }, (err) => {
            console.log(err);
          });
      } else {
        console.log('error, token and email are undefined');
      }
    });
  }

  /**
   * Reaction method when a symptom is clicked from the list of symptoms
   * @param symptom
   */
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

  private buildChartNumberOfOccurrencesPerDay(symptoms: Symptom[]) {
    let chartData = {labels: [], datasets: []};

    this.sortOccurrencesPerDate(symptoms);
    let {minDate, maxDate} = this.findMinDateAndMaxDate(symptoms);
    let numberOfDays = Math.abs(moment(maxDate).diff(minDate, 'days')) + 1;

    this.fillLabelsOfChartDataWithDays(numberOfDays, minDate, chartData);
    this.createDatasetForNumberOfOccurrencesPerDay(symptoms, numberOfDays, minDate, chartData);

    this.nbOfOccurrencesPerDayGraph.data = chartData;
  }

  /**
   * Build the dataset for the graph NumberOfOccurrencesPerDay
   * @param symptoms
   * @param numberOfDays
   * @param minDate
   * @param chartData
   */
  private createDatasetForNumberOfOccurrencesPerDay(symptoms: Symptom[],
                                                    numberOfDays: number,
                                                    minDate: Date,
                                                    chartData: { labels: string[]; datasets: any[] }) {
    symptoms.forEach((symptom: Symptom) => {
      let dataset = {
        label: symptom.name,
        data: new Array(numberOfDays).fill(0),
        backgroundColor: this.symptomsColors.get(symptom.id),
        borderColor: this.symptomsColors.get(symptom.id),
        fill: false
      };
      symptom.occurrences.forEach((occurrence: Occurrence) => {
        let indexInDataArray = Math.abs(moment(occurrence.date).diff(minDate, 'days'));
        dataset.data[indexInDataArray] += 1;
      });
      chartData.datasets.push(dataset);
    });
  }

  /**
   * Fill the chartData with labels representing the date on format DD MM YYYY
   * starting from minDate and for numberOfDays days
   * @param numberOfDays
   * @param minDate
   * @param chartData
   */
  private fillLabelsOfChartDataWithDays(numberOfDays: number,
                                        minDate: Date,
                                        chartData: { labels: string[]; datasets: any[] }) {
    for (let i = 0; i < numberOfDays; i++) {
      let dayLabel: string = moment(minDate).add(i, 'days').format('DD MMM YYYY');
      chartData.labels.push(dayLabel);
    }
  }

  /**
   * Iterate over the occurrences of symptoms to find the min and max dates
   * @param symptoms
   * @returns {{minDate: Date, maxDate: Date}}
   */
  private findMinDateAndMaxDate(symptoms: Symptom[]) {
    let minDate: Date = moment().add(1, 'days').toDate();
    let maxDate: Date = moment('2000-01-01').toDate();
    symptoms.forEach((symptom: Symptom) => {
      symptom.occurrences.forEach((occurrence: Occurrence) => {
        if (minDate > occurrence.date) {
          minDate = occurrence.date;
        }
        if (maxDate < occurrence.date) {
          maxDate = occurrence.date;
        }
      });
    });
    return {minDate, maxDate};
  }

  /**
   * The occurrences of each symptom are sorted per date.
   * The earliest occurrences goes first in the array and the latest goes last.
   * @param symptoms
   */
  private sortOccurrencesPerDate(symptoms: Symptom[]) {
    symptoms.forEach((symptom: Symptom) => {
      symptom.occurrences.sort((a: Occurrence, b: Occurrence) => {
        return a.date > b.date ? 1 : -1;
      });
    });
  }

  private buildChartNumberOfOccurrencesPerSymptom(symptoms: Symptom[]) {
    let chartData = {labels: [], datasets: []};
    symptoms.forEach((symptom: Symptom) => {
      chartData.labels.push(symptom.name);
    });

    let dataset = {
      label: 'Occurrences',
      data: []
    };
    symptoms.forEach((symptom: Symptom) => {
      dataset.data.push(symptom.occurrences.length);
    });
    chartData.datasets.push(dataset);
    this.nbOfOccurrencesPerSymptomGraph.data = chartData;
  }

  /**
   * Initiate the variable symptomsList and selectedSymptoms
   * @param report
   */
  private buildSymptomsList(report: Report) {
    this.symptomsList = report.symptoms;
    this.symptomsList.forEach((symptom) => {
      this.selectedSymptoms.push(symptom);
    });
  }

  /**
   * Update all graph based on the selected symptoms
   */
  private updateGraphs() {
    this.buildChartNumberOfOccurrencesPerSymptom(this.selectedSymptoms);
    this.buildChartNumberOfOccurrencesPerDay(this.selectedSymptoms);
  }

  /**
   * Order the selected symptoms by name
   */
  private orderSelectedSymptoms() {
    this.selectedSymptoms.sort((a: Symptom, b: Symptom) => {
      return a.name > b.name ? 1 : -1;
    });
  }

  /**
   * Iterate over the occurrences to convert the string representation of Date
   * to JavaScript object Date
   * @param report
   */
  private convertStringDatesToDates(report: Report) {
    report.symptoms.forEach((symptom: Symptom) => {
      symptom.occurrences.forEach((occurrence) => {
        occurrence.date = moment(occurrence.date).toDate();
      });
    });
  }

  /**
   * Generate random colors for each symptom
   * @param report
   */
  private createRandomColorsForSymptom(report: Report) {
    let colors = randomColor({count: report.symptoms.length});
    report.symptoms.forEach((symptom: Symptom, index: number) => {
      this.symptomsColors.set(symptom.id, colors[index]);
    });

  }
}
