import {Injectable} from '@angular/core';
import {Resource} from '../models/resource';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {Constants} from '../constants';
import {JsonApiDataStore} from 'jsonapi-datastore';

@Injectable()
export class ResourceService {
  private readonly resourcesUrl = Constants.BASE_URL + 'resources';

  constructor(private http: Http) { }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred');
    return Promise.reject(error.message || error);
  }

  getResources(): Promise<Resource[]> {
    return this.http.get(`${this.resourcesUrl}?include=attachments`) // TODO don't hardcode
      .toPromise()
      .then(response => {
        return new JsonApiDataStore().sync(response.json());
      })
      .catch(this.handleError);
  }
  getResource(id: number): Promise<Resource> {
    const url = `${this.resourcesUrl}/${id}?include=translations`;
    return this.http.get(url)
      .toPromise()
      .then(function(response){
        return new JsonApiDataStore().sync(response.json());
      })
      .catch(this.handleError);
  }
  update(resource: Resource): Promise<Resource> {
    const url = `${this.resourcesUrl}/${resource.id}`;
    return this.http
      .put(url, JSON.stringify(resource), Constants.OPTIONS)
      .toPromise()
      .then(() => resource)
      .catch(this.handleError);
  }
}
