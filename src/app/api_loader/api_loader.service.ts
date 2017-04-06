import { Injectable, isDevMode } from '@angular/core';
import { KEY } from '../../../key';
import { Http } from '@angular/http';

@Injectable()
export class ApiLoaderService {
  private _apiLoadingPromise: Promise<void>;
  private _callback: string = 'googleMapsReady';

  constructor(private  http: Http) {
  }

  public loadApi(): Promise<void> {
    if (this._apiLoadingPromise) {
      return this._apiLoadingPromise;
    } else {
      return this._apiLoadingPromise = new Promise<void>((resolve, reject) => {
        this._loadScript().then((script) => {
          document.getElementsByTagName('head')[0].appendChild(script);
          resolve();
        });
      });
    }
  }

  private _loadScript(): Promise<any> {
    return new Promise < any >((resolve, reject) => {
      this.http.get(process.env.API_GOOGLE_MAP).map((res) => res.json()).subscribe((data) => {
        if (data) {
          let googleMapKey = data['key'];
          let script = document.createElement('script');
          script.type = 'text/javascript';
          script.async = true;
          script.src = 'https://maps.googleapis.com/maps/api/js?key=' + googleMapKey + '&callback=' + this._callback;
          resolve(script);
        }
      });
    });
  }

}
