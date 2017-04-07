import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Symptom } from '../../../models/symptom';
import { Occurrence } from '../../../models/occurrence';
import moment from 'moment';
import { isNullOrUndefined } from 'util';
import { FactorInstance } from '../../../models/factor_instance';
import { OccurrenceWithSymptomName } from '../../../models/occurrence_with_symptom_name';

@Component({
  selector: 'occurrences-details',
  templateUrl: './occurrencesDetails.html',
})
export class OccurrencesDetailsComponent implements OnChanges {
  @Input() public symptoms: Symptom[];
  public flattenOccurrence: OccurrenceWithSymptomName[];
  public visibleOccurrences: OccurrenceWithSymptomName[];
  public pages: number[];
  public currentPage: number;
  private maxElementsPerPage: number = 10;

  public ngOnChanges(changes: SimpleChanges): void {
    let newSymptoms: Symptom[] = changes['symptoms'].currentValue;
    if (!isNullOrUndefined(newSymptoms)) {
      this.generateFlattenOccurrencesArray(newSymptoms);
      this.generatePagesNumber(this.flattenOccurrence);
      this.setVisibleOccurrencesForPage(1);
    }
  }

  public getFormatedDay(occurrence: Occurrence): string {
    return moment(occurrence.date).format('DD-MM-YYYY');
  }

  public getFormatedHour(occurrence: Occurrence): string {
    return moment(occurrence.date).format('HH:mm:ss');
  }

  public getWeather(occurrence: Occurrence): string {
    if (isNullOrUndefined(occurrence.factor_instances)) {
      return '-';
    } else {
      let factorInstance: FactorInstance = this.searchFactorInstanceWithId(occurrence.factor_instances, 3);
      return factorInstance === undefined ? '-' : factorInstance.value;
    }
  }

  public getTemperature(occurrence: Occurrence): string {
    if (isNullOrUndefined(occurrence.factor_instances)) {
      return '-';
    } else {
      let factorInstance: FactorInstance = this.searchFactorInstanceWithId(occurrence.factor_instances, 1);
      return factorInstance === undefined ? '-' : factorInstance.value;
    }
  }

  public getHumidity(occurrence: Occurrence): string {
    if (isNullOrUndefined(occurrence.factor_instances)) {
      return '-';
    } else {
      let factorInstance: FactorInstance = this.searchFactorInstanceWithId(occurrence.factor_instances, 2);
      return factorInstance === undefined ? '-' : factorInstance.value;
    }
  }

  public pageClicked(pageNumber: number) {
    if (pageNumber === 0) {
      this.currentPage = this.pages.length;
    } else if (pageNumber > this.pages.length) {
      this.currentPage = 1;
    } else {
      this.currentPage = pageNumber;
    }
    this.setVisibleOccurrencesForPage(this.currentPage);
  }

  private searchFactorInstanceWithId(factors_instances: FactorInstance[], id: number): FactorInstance {
    return factors_instances.find((factor_instance: FactorInstance) => {
      return factor_instance.factor_id === id;
    });
  }

  private setVisibleOccurrencesForPage(pageNumber: number) {
    let startIndex = this.maxElementsPerPage * (pageNumber - 1);
    let endIndex = startIndex + this.maxElementsPerPage;
    this.visibleOccurrences = this.flattenOccurrence.slice(startIndex, endIndex);
  }

  private generateFlattenOccurrencesArray(symptoms: Symptom[]) {
    this.flattenOccurrence = [];
    symptoms.forEach((symptom) => {
      symptom.occurrences.forEach((occurrence: Occurrence) => {
        let occurrenceWithSymptomName: OccurrenceWithSymptomName = occurrence as OccurrenceWithSymptomName;
        occurrenceWithSymptomName.symptomName = symptom.name;
        this.flattenOccurrence.push(occurrenceWithSymptomName);
      });
    });
  }

  private generatePagesNumber(flattenOccurrence: OccurrenceWithSymptomName[]) {
    this.pages = [];
    this.currentPage = 1;
    let numberOfPages = Math.ceil(flattenOccurrence.length / this.maxElementsPerPage);
    for (let i = 1; i <= numberOfPages; i++) {
      this.pages.push(i);
    }
  }
}
