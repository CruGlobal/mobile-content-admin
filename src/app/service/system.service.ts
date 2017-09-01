import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {JsonApiDataStore} from 'jsonapi-datastore';
import {System} from '../models/system';
import {environment} from '../../environments/environment';
import {request_constants} from './request-constants';
import {AbstractService} from './abstract.service';

@Injectable()
export class SystemService extends AbstractService {
  private readonly systemsUrl = environment.base_url + 'systems';

  constructor(private http: Http) {
    super();
  }

  getSystems(): Promise<System[]> {
    return this.http.get(this.systemsUrl, request_constants.options)
      .toPromise()
      .then(response => new JsonApiDataStore().sync(response.json()))
      .catch(this.handleError);
  }
}
