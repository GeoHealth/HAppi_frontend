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
import { Spinner } from '../services/spinner/spinner.service';
import * as jsPDF from 'jspdf';
import '../../../node_modules/jspdf-autotable/dist/jspdf.plugin.autotable.js';
import { OccurrencesDetailsComponent } from '../components/occurrencesDetails/occurrencesDetails.component';
import * as html2canvas from 'html2canvas';

@Component({
  selector: 'report',
  styleUrls: ['./report.component.scss'],
  templateUrl: `./report.component.html`
})

export class ReportComponent implements OnInit {
  public nbOfOccurrencesPerSymptomGraph = {
    type: 'bar',
    data: {
      labels: [],
      datasets: []
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      },
      legend: {
        display: false
      }
    }
  };
  public dailyDistributionOfSymptomsGraph = {
    type: 'doughnut',
    data: {
      labels: [],
      datasets: []
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: true,
        position: 'left',
        fullWidth: true
      }
    }
  };
  public startDate: string;
  public endDate: string;
  public symptomsList: Symptom[] = [];
  public selectedSymptoms: Symptom[] = [];
  public symptomsColors: string[] = [];
  private occurrencesDetails: OccurrencesDetailsComponent

  constructor(private reportRestService: ReportRestAPI,
              private activatedRoute: ActivatedRoute,
              private _spinner: Spinner) {
    this._spinner.show();
    this.occurrencesDetails = new OccurrencesDetailsComponent();
  }

  public ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      let token = params['token'];
      let email = params['email'];
      if (token && email) {
        this.reportRestService.getReport(token, email)
          .subscribe((report: Report) => {
            this.buildTitleDates(report);
            this.convertStringDatesToDates(report);
            this.buildSymptomsList(report);
            this.createRandomColorsForSymptom(report);
            this.updateGraphs();
            this._spinner.hide();
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
    this.updateGraphs();
  }

  public toPDF() {
    // Creation of the pdf
    let doc = new jsPDF();
    let columns_symptoms = ['Symptom', 'Number of occurrences'];
    let rows_symptoms = [];
    let columns_occurrences = ['Symptom', 'Day', 'Hour', 'Weather', 'Temperature (C°)', 'Humidity (%)'];
    let rows_occurrences = [];
    // Set title to the PDF
    doc.text('Report from ' + this.startDate + ' to ' + this.endDate, 10, 20);
    // Build Data Set
    this.symptomsList.forEach((symptom: Symptom) => {
      rows_symptoms.push([symptom.name, symptom.occurrences.length]);
      symptom.occurrences.forEach((occurrence: Occurrence) => {
        rows_occurrences.push([symptom.name , this.occurrencesDetails.getFormatedDay(occurrence),
          this.occurrencesDetails.getFormatedHour(occurrence), this.occurrencesDetails.getWeather(occurrence),
          this.occurrencesDetails.getTemperature(occurrence), this.occurrencesDetails.getHumidity(occurrence)]);
      });

    });
    // Add table of symptom to the PDF
    doc.autoTable(columns_symptoms, rows_symptoms, {
      startY: 50
    });
    // Add table of occurrences to the PDF
    doc.autoTable(columns_occurrences, rows_occurrences, {
      startY: doc.autoTable.previous.finalY + 15,
      margin: {horizontal: 7},
      bodyStyles: {valign: 'top'},
      styles: {overflow: 'linebreak', columnWidth: 'wrap'},
      columnStyles: {text: {columnWidth: 'auto'}}
    });
    // Add Occurrences per symptom charts to pdf
    doc.addPage();
    const nbOfOccurrencesPerSymptom = document.getElementById('nbOfOccurrencesPerSymptom');
    doc.addHTML(nbOfOccurrencesPerSymptom, () => {
      doc.addPage();
    });
    // Add Occurrences per day charts to pdf
    const nbOfOccurrencesPerDay = document.getElementById('nbOfOccurrencesPerDay');
    doc.addHTML(nbOfOccurrencesPerDay, () => {
    });
    setTimeout(() => {
      doc.save('result.pdf');
    });
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
      data: [],
      backgroundColor: []
    };
    symptoms.forEach((symptom: Symptom) => {
      dataset.data.push(symptom.occurrences.length);
      dataset.backgroundColor.push(this.symptomsColors[symptom.id]);
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
    this.orderSelectedSymptoms();
    this.sortOccurrencesPerDate(this.selectedSymptoms);
    this.selectedSymptoms = Array.from(this.selectedSymptoms);
    this.buildChartNumberOfOccurrencesPerSymptom(this.selectedSymptoms);
    this.buildChartDailyDistributionOfSymptoms(this.selectedSymptoms);
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
    let colors = randomColor({count: report.symptoms.length, luminosity: 'light'});
    report.symptoms.forEach((symptom: Symptom, index: number) => {
      this.symptomsColors[symptom.id] = colors[index];
    });
  }

  /**
   * Compute the dataset for the daily distribution of Symptoms
   * @param symptoms
   */
  private buildChartDailyDistributionOfSymptoms(symptoms: Symptom[]) {
    let chartData = {labels: ['Morning', 'Noon', 'Afternoon', 'Evening', 'Night'], datasets: []};

    let dataset = {
      backgroundColor: ['#FD1F5E', '#1EF9A1', '#68F000', '#FF8C00', '#4682B4'],
      data: new Array(5).fill(0)
    };

    symptoms.forEach((symptom: Symptom) => {
      symptom.occurrences.forEach((occurrence: Occurrence) => {
        let hour = occurrence.date.getHours();
        if (hour < 2) { // Night occurrence
          dataset.data[3] += 1;
        } else if (hour < 8) { // Morning occurrence
          dataset.data[4] += 1;
        } else if (hour < 12) { // Noon occurrence
          dataset.data[0] += 1;
        } else if (hour < 14) { // Afternoon occurrence
          dataset.data[1] += 1;
        } else if (hour < 19) { // Evening occurrence
          dataset.data[2] += 1;
        } else { // Night occurrence 
          dataset.data[3] += 1;
        }
      });
    });

    chartData.datasets.push(dataset);

    this.dailyDistributionOfSymptomsGraph.data = chartData;
  }

  private buildTitleDates(report: Report) {
    this.startDate = moment(report.start_date).format('Do MMM YYYY');
    this.endDate = moment(report.end_date).format('Do MMM YYYY');
  }
}
