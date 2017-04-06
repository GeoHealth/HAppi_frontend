import { Component, Input, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';

import '../../../assets/js/markerclusterer.js';
import { Symptom } from '../../../models/symptom';
import { Occurrence } from '../../../models/occurrence';
import { ApiLoaderService } from '../../api_loader/api_loader.service';

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
  private zoom: number = 3;
  private lat: number = 51.673858;
  private lng: number = 7.815982;
  private googleMarkers: any;
  private map: any;

  constructor(private als: ApiLoaderService) {
  }

  public ngAfterViewInit() {
    //
  }

  public ngOnChanges(changes: SimpleChanges): void {
    (window as any).googleMapsReady = this.createMap.bind(this);
    this.als.loadApi();
  }

  private createMap() {
    this.googleMarkers = this.initMarkers();
    this.map = new google.maps.Map(document.getElementById('bubbleMap'), {
      zoom: this.zoom,
      center: {lat: this.lat, lng: this.lng}
    });
    let mc = new MarkerClusterer(this.map, this.googleMarkers,
      {imagePath: 'https://googlemaps.github.io/js-marker-clusterer/images/m'});
  }

  private initMarkers() {
    let markers = [];
    this.symptoms.forEach((symptom: Symptom) => {
      symptom.occurrences.forEach((occurrence: Occurrence) => {
        markers.push(new google.maps.Marker({
          position: {lat: occurrence.gps_coordinate.latitude, lng: occurrence.gps_coordinate.longitude}
        }));
      });
    });
    return markers;
  }
}
