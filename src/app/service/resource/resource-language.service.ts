import {Injectable} from '@angular/core';
import {ResourceLanguage} from '../../models/resource-language';
import {Http} from '@angular/http';

import {JsonApiDataStore} from 'jsonapi-datastore';
import {AuthService} from '../auth/auth.service';
import {environment} from '../../../environments/environment';
import {AbstractService} from '../abstract.service';

@Injectable()
export class ResourceLanguageService extends AbstractService {
  private readonly resourcesUrl = environment.base_url + 'resources_languages';

  constructor(private http: Http, private authService: AuthService) {
    super();
  }

  getResourceLanguage(id: number, include: string): Promise<ResourceLanguage> {
    const url = `${this.resourcesUrl}/${id}?include=${include}`;
    return this.http.get(url)
      .toPromise()
      .then(function(response){
        return new JsonApiDataStore().sync(response.json());
      })
      .catch(this.handleError);
  }

  update(resource: ResourceLanguage): Promise<ResourceLanguage> {
    return this.http.put(`${this.resourcesUrl}/${resource.id}`, this.getPayload(resource), this.authService.getAuthorizationAndOptions())
      .toPromise()
      .then(() => resource)
      .catch(this.handleError);
  }

  private getPayload(resourceLanguage: ResourceLanguage) {
    return {
      data: {
        id: resourceLanguage.id,
        type: 'resource',
        attributes: {
          id: resourceLanguage.id,
        }
      }
    };
  }
}
