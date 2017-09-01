import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {JsonApiDataStore} from 'jsonapi-datastore';
import {ResourceType} from '../models/resource-type';
import {environment} from '../../environments/environment';
import {AbstractService} from './abstract.service';

@Injectable()
export class ResourceTypeService extends AbstractService {
  private readonly resourceTypesUrl = environment.base_url + 'resource_types';

  constructor(private http: Http) {
    super();
  }

  getResourceTypes(): Promise<ResourceType[]> {
    return this.http.get(this.resourceTypesUrl, this.requestOptions)
      .toPromise()
      .then(response => new JsonApiDataStore().sync(response.json()))
      .catch(this.handleError);
  }
}
