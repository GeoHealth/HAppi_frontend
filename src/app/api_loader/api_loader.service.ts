import { Injectable } from '@angular/core';
import { KEY } from '../../../key';

@Injectable()
export class ApiLoaderService {
  private _apiLoadingPromise: Promise<void>;
  private _googleMapKey: String;
  private _callback: string = 'googleMapsReady';

  constructor() {
    this._googleMapKey = KEY.GOOGLE_MAP_KEY;
  }

  public loadApi(): Promise<void> {
    if (this._apiLoadingPromise) {
      return this._apiLoadingPromise;
    } else {
      return this._apiLoadingPromise = new Promise<void>( (resolve, reject) => {
        let script = this._loadScript();
        document.getElementsByTagName('head')[0].appendChild(script);
        resolve();
      });
    }
  }

  private _loadScript(): any {
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src =  'https://maps.googleapis.com/maps/api/js?key=' + this._googleMapKey + '&callback=' + this._callback;
    return script;
  }
}
