import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {Constants} from '../constants';
import {JsonApiDataStore} from 'jsonapi-datastore';
import {ResourceType} from '../models/resource-type';

@Injectable()
export class ResourceTypeService {
  private readonly resourceTypesUrl = Constants.BASE_URL + 'resource_types';

  constructor(private http: Http) { }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred');
    return Promise.reject(error.message || error);
  }

  getResourceTypes(): Promise<ResourceType[]> {
    return this.http.get(this.resourceTypesUrl, Constants.OPTIONS)
      .toPromise()
      .then(response => new JsonApiDataStore().sync(response.json()))
      .catch(this.handleError);
  }
}
