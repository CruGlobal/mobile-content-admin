import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {Constants} from '../constants';
import {JsonApiDataStore} from 'jsonapi-datastore';
import {System} from '../models/system';

@Injectable()
export class SystemService {
  private readonly systemsUrl = Constants.BASE_URL + 'systems';

  constructor(private http: Http) { }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred');
    return Promise.reject(error.message || error);
  }

  getSystems(): Promise<System[]> {
    return this.http.get(this.systemsUrl, Constants.OPTIONS)
      .toPromise()
      .then(response => new JsonApiDataStore().sync(response.json()))
      .catch(this.handleError);
  }
}
