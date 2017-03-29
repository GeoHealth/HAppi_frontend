import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Http, Response } from '@angular/http';

@Injectable()
export class BaseRestAPI {
  private apiProtocol = API_REST_PROTOCOL;
  private apiDomainName = API_REST_DOMAIN;
  private apiPort = API_REST_PORT;
  private apiVersion = API_REST_VERSION;

  constructor(private http: Http) {
    console.log(this.apiDomainName);
  }
}
