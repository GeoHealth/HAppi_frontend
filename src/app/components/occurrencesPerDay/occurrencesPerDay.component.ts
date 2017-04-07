import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Symptom } from '../../../models/symptom';
import { Occurrence } from '../../../models/occurrence';
import { isNullOrUndefined } from 'util';
import moment from 'moment';

@Component({
  selector: 'occurrences-per-day',
  templateUrl: './occurrencesPerDay.html',
})
export class OccurrencesPerDayComponent implements OnChanges {
  @Input() public symptoms: Symptom[];
  @Input() public symptomsColors: string[] = [];

  public type: string = 'line';
  public data: Object = {
    labels: [],
    datasets: []
  };
  public options: Object = {
    responsive: true,
    maintainAspectRatio: false,
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
  };

  public ngOnChanges(changes: SimpleChanges): void {
    let newSymptoms: Symptom[] = changes['symptoms'].currentValue;
    if (!isNullOrUndefined(newSymptoms)) {
      this.buildChartNumberOfOccurrencesPerDay(newSymptoms);
    }
  }

  private buildChartNumberOfOccurrencesPerDay(symptoms: Symptom[]) {
    let chartData = {labels: [], datasets: []};

    let {minDate, maxDate} = this.findMinDateAndMaxDate(symptoms);
    let numberOfDays = Math.abs(moment(maxDate).diff(minDate, 'days')) + 1;

    this.fillLabelsOfChartDataWithDays(numberOfDays, minDate, chartData);
    this.createDatasetForNumberOfOccurrencesPerDay(symptoms, numberOfDays, minDate, chartData);

    this.data = chartData;
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
        backgroundColor: this.symptomsColors[symptom.id],
        borderColor: this.symptomsColors[symptom.id],
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
   * minDate will always have its hour, minutes and seconds set to 0
   * maxDate will always be at 23:59:59
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
    minDate = moment(minDate).toDate();
    maxDate = moment(maxDate).toDate();
    minDate.setHours(0, 0, 0);
    maxDate.setHours(23, 59, 59);
    return {minDate, maxDate};
  }
}
