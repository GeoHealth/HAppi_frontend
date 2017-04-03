import { Component, ViewChild, Input, ElementRef, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';

import 'fullcalendar/dist/fullcalendar.js';
import 'style-loader!./fullCalendar.scss';
import { Symptom } from '../../../models/symptom';
import { Occurrence } from '../../../models/occurrence';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'full-calendar',
  templateUrl: './fullCalendar.html',
})
export class FullCalendarComponent implements AfterViewInit, OnChanges {

  @Input() public symptoms: Symptom[];
  @Input() public symptomsColors: string[] = [];

  @ViewChild('fullCalendar') public _selector: ElementRef;

  private calendar: any;
  private fullCalendarConfiguration: Object = {
    eventLimit: 4,
    eventTextColor: '#000'
  };

  public ngAfterViewInit() {
    this.calendar = $(this._selector.nativeElement).fullCalendar(this.fullCalendarConfiguration);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (!isNullOrUndefined(this.calendar)) {
      let newSymptoms: Symptom[] = changes['symptoms'].currentValue;
      this.calendar.fullCalendar('removeEvents');
      let events = [];
      newSymptoms.forEach((symptom: Symptom) => {
        symptom.occurrences.forEach((occurrence: Occurrence) => {
          let newEvent = {title: symptom.name, start: occurrence.date, color: this.symptomsColors[symptom.id], };
          events.push(newEvent);
        });
      });
      this.calendar.fullCalendar('addEventSource', events);
    }
  }
}
