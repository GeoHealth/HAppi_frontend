import { Component, Input, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';

import '../../../assets/js/markerclusterer.js';
import { Symptom } from '../../../models/symptom';
import { Occurrence } from '../../../models/occurrence';
import { ApiLoaderService } from '../../api_loader/api_loader.service';
import { isNullOrUndefined } from 'util';

declare const MarkerClusterer: any;
declare const google: any;

@Component({
  selector: 'bubble-map',
  templateUrl: 'bubbleMap.html',
  styleUrls: ['bubbleMap.scss']
})

export class BubbleMapComponent implements AfterViewInit, OnChanges {

  @Input() public symptoms: Symptom[];
  @Input() public symptomsColors: string[] = [];

  public title: string = 'Geolocalisation';
  private zoom: number = 6;
  private googleMarkers: any;
  private map: any;
  private mc: any;
  private markerBounds: any;

  constructor(private als: ApiLoaderService) {
    this.bindLocalEvent();
    this.als.loadApi();
  }

  public ngAfterViewInit() {
    //
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (!isNullOrUndefined(this.map)) {
      this.symptoms = changes['symptoms'].currentValue;
      this.createMap();
    }
  }

  private bindLocalEvent() {
    (window as any).googleMapsReady = this.createMap.bind(this);
  }

  private createMap() {

    this.map = new google.maps.Map(document.getElementById('bubbleMap'), {
      zoom: this.zoom,
    });
    this.markerBounds = new google.maps.LatLngBounds();
    this.googleMarkers = this.initMarkers();
    this.map.fitBounds(this.markerBounds);
    this.updateMarkers();
  }

  private updateMarkers() {
    this.mc = new MarkerClusterer(this.map, this.googleMarkers,
      {
        imagePath: 'https://googlemaps.github.io/js-marker-clusterer/images/m',
        maxZoom: 20
      });
  }

  private initMarkers() {
    let infoWin = new google.maps.InfoWindow();
    let markers = [];
    this.symptoms.forEach((symptom: Symptom) => {
      symptom.occurrences.forEach((occurrence: Occurrence) => {
        if (!isNullOrUndefined(occurrence.gps_coordinate)) {
          let point = new google.maps.LatLng(occurrence.gps_coordinate.latitude, occurrence.gps_coordinate.longitude);
          let marker = new google.maps.Marker({
            position: point
          });
          google.maps.event.addListener(marker, 'click', (() => {
            infoWin.setContent(symptom.name);
            infoWin.open(this.map, marker);
          }));
          this.markerBounds.extend(point);
          markers.push(marker);
        }
      });
    });
    return markers;
  }
}
