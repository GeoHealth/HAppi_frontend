import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Symptom } from '../../../models/symptom';
import { Occurrence } from '../../../models/occurrence';
import moment from 'moment';
import { isNullOrUndefined } from 'util';
import { FactorInstance } from '../../../models/factor_instance';

@Component({
  selector: 'occurrences-details',
  templateUrl: './occurrencesDetails.html',
})
export class OccurrencesDetailsComponent implements OnChanges {
  @Input() public symptoms: Symptom[];

  public ngOnChanges(changes: SimpleChanges): void {
    // nothing to do but still keep this method to force the update of html
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

  private searchFactorInstanceWithId(factors_instances: FactorInstance[], id: number): FactorInstance {
    return factors_instances.find((factor_instance: FactorInstance) => {
      return factor_instance.factor_id === id;
    });
  }
}
