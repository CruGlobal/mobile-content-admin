import { Injectable } from '@angular/core';
import { ResourceLanguage } from '../../models/resource-language';
import { HttpClient } from '@angular/common/http';
import { JsonApiDataStore } from 'jsonapi-datastore';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../environments/environment';
import { AbstractService } from '../abstract.service';

@Injectable()
export class ResourceLanguageService extends AbstractService {
  private readonly resourcesUrl = environment.base_url + 'resources';

  constructor(readonly http: HttpClient, readonly authService: AuthService) {
    super();
  }

  getResourceLanguage(
    resourceLanguage: ResourceLanguage,
  ): Promise<ResourceLanguage> {
    const url = `${this.resourcesUrl}/${resourceLanguage.resource.id}/languages/${resourceLanguage.language.id}`;
    return this.http
      .get(url)
      .toPromise()
      .then(function (response) {
        return new JsonApiDataStore().sync(response);
      })
      .catch(this.handleError);
  }

  update(resourceLanguage: ResourceLanguage): Promise<ResourceLanguage> {
    const url = `${this.resourcesUrl}/${resourceLanguage.resource.id}/languages/${resourceLanguage.language.id}`;
    return this.http
      .put(
        url,
        this.getPayload(resourceLanguage),
        this.authService.getAuthorizationAndOptions(),
      )
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
          'attr-include-tips': resourceLanguage.includeTips,
        },
      },
    };
  }
}
