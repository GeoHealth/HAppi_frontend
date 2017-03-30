import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { isNullOrUndefined } from 'util';
import { Observable } from 'rxjs';

@Injectable()
export class BaseRestAPI {
  private apiProtocol = API_REST_PROTOCOL;
  private apiDomainName = API_REST_DOMAIN;
  private apiPort = API_REST_PORT;
  private apiVersion = API_REST_VERSION;
  private http: Http;

  constructor(http: Http) {
    this.http = http;
  }

  public makeGET(path: string, parameters?: Map<String, String>): Observable<Response> {
    let headers = new Headers({'Content-Type': 'application/json'});
    return this.http.get(
      this.computeFullURL(path, parameters),
      headers
    ).map(BaseRestAPI.handleResponse)
      .catch(BaseRestAPI.handleError);
  }

  private computeFullURL(path: string, parameters?: Map<String, String>) {
    let pathedURL = this.computeBaseURL() + path;
    return this.appendParametersToURL(pathedURL, parameters);
  }

  private computeBaseURL() {
    return this.apiProtocol + '://' + this.apiDomainName + ':'
      + this.apiPort + '/' + this.apiVersion + '/';
  }

  private appendParametersToURL(url: string, parameters: Map<String, String>) {
    if (!isNullOrUndefined(parameters)) {
      url += '?';
      parameters.forEach((value: String, key: String) => {
        url += key + '=' + value + '&';
      });
    }
    return url;
  }

  private static handleResponse(rawResponse: Response) {
    let body = rawResponse.json();
    return body.data || {};
  }

  private static handleError(error: Response | any) {
    return Observable.throw(error);
  }
}
