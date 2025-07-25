import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JsonApiDataStore } from 'jsonapi-datastore';
import { environment } from '../../environments/environment';
import { System } from '../models/system';
import { AbstractService } from './abstract.service';

@Injectable()
export class SystemService extends AbstractService {
  private readonly systemsUrl = environment.base_url + 'systems';

  constructor(private http: HttpClient) {
    super();
  }

  getSystems(): Promise<System[]> {
    return this.http
      .get(this.systemsUrl, this.requestOptions)
      .toPromise()
      .then((response) => new JsonApiDataStore().sync(response))
      .catch(this.handleError);
  }
}
