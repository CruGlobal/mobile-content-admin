import {Injectable} from '@angular/core';
import {ResourceLanguage} from '../../models/resource-language';
import {Http} from '@angular/http';

import {JsonApiDataStore} from 'jsonapi-datastore';
import {AuthService} from '../auth/auth.service';
import {environment} from '../../../environments/environment';
import {AbstractService} from '../abstract.service';

@Injectable()
export class ResourceLanguageService extends AbstractService {
  private readonly resourcesUrl = environment.base_url + 'resources';

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

  update(resourceLanguage: ResourceLanguage): Promise<ResourceLanguage> {
    const url = `${this.resourcesUrl}/${resourceLanguage.resource.id}/languages/${resourceLanguage.language.id}`;
    return this.http.put(url, this.getPayload(resourceLanguage), this.authService.getAuthorizationAndOptions())
      .toPromise()
      .then(() => resourceLanguage)
      .catch(this.handleError);
  }

  private getPayload(resourceLanguage: ResourceLanguage) {
    return {
      data: {
        id: resourceLanguage.resource.id + '-' + resourceLanguage.language.id,
        type: 'resource-language',
        attributes: {
          'attr-include-tips': resourceLanguage.includeTips === true ? 'true' : 'false'
        }
      }
    };
  }
}
