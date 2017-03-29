import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Http, Response } from '@angular/http';

declare const ENV;

@Injectable()
export class BaseRestAPI {
  private apiProtocol = ENV.api_rest.protocol;
  private apiDomainName = ENV.api_rest.domain;
  private apiPort = ENV.api_rest.port;
  private apiVersion = ENV.api_rest.version;

  constructor(private http: Http) {
    console.log(this.apiDomainName);
  }
}
