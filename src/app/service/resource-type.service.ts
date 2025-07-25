import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JsonApiDataStore } from 'jsonapi-datastore';
import { environment } from '../../environments/environment';
import { ResourceType } from '../models/resource-type';
import { AbstractService } from './abstract.service';

@Injectable()
export class ResourceTypeService extends AbstractService {
  private readonly resourceTypesUrl = environment.base_url + 'resource_types';

  constructor(readonly http: HttpClient) {
    super();
  }

  getResourceTypes(): Promise<ResourceType[]> {
    return this.http
      .get(this.resourceTypesUrl, this.requestOptions)
      .toPromise()
      .then((response) => new JsonApiDataStore().sync(response))
      .catch(this.handleError);
  }
}
