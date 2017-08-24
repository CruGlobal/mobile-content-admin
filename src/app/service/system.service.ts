import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {JsonApiDataStore} from 'jsonapi-datastore';
import {System} from '../models/system';
import {environment} from '../../environments/environment';
import {request_constants} from './request-constants';

@Injectable()
export class SystemService {
  private readonly systemsUrl = environment.base_url + 'systems';

  constructor(private http: Http) { }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred');
    return Promise.reject(error.message || error);
  }

  getSystems(): Promise<System[]> {
    return this.http.get(this.systemsUrl, request_constants.options)
      .toPromise()
      .then(response => new JsonApiDataStore().sync(response.json()))
      .catch(this.handleError);
  }
}
