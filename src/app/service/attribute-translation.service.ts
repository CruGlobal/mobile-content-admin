import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JsonApiDataStore } from 'jsonapi-datastore';
import { environment } from '../../environments/environment';
import { AttributeTranslation } from '../models/attribute-translation';
import { Resource } from '../models/resource';
import { AbstractService } from './abstract.service';
import { AuthService } from './auth/auth.service';

@Injectable()
export class AttributeTranslationService extends AbstractService {
  private readonly resourceUrl = environment.base_url + 'resources';

  constructor(readonly http: HttpClient, readonly authService: AuthService) {
    super();
  }

  getAttributes(resourceId: Number): Promise<Resource> {
    const url = `${this.resourceUrl}/${resourceId}?include=translated-attributes`;
    return this.http
      .get(url, this.authService.getAuthorizationAndOptions())
      .toPromise()
      .then((response) => new JsonApiDataStore().sync(response))
      .catch(this.handleError);
  }

  create(
    resourceId: Number,
    attribute: AttributeTranslation,
  ): Promise<AttributeTranslation> {
    const url = `${this.resourceUrl}/${resourceId}/translated-attributes`;

    const payload = {
      data: {
        type: 'translated-attribute',
        attributes: {
          key: attribute.key,
          'crowdin-phrase-id': attribute['crowdin-phrase-id'],
          required: attribute.required,
        },
      },
    };

    return this.http
      .post(url, payload, this.authService.getAuthorizationAndOptions())
      .toPromise()
      .then((response) => new JsonApiDataStore().sync(response))
      .catch(this.handleError);
  }

  update(attribute: AttributeTranslation): Promise<AttributeTranslation> {
    const url = `${this.resourceUrl}/${attribute.resource.id}/translated-attributes/${attribute.id}`;

    const payload = {
      data: {
        id: attribute.id,
        type: 'translated-attribute',
        attributes: {
          key: attribute.key,
          'crowdin-phrase-id': attribute['crowdin-phrase-id'],
          required: attribute.required,
        },
      },
    };

    return this.http
      .put(url, payload, this.authService.getAuthorizationAndOptions())
      .toPromise()
      .then((response) => new JsonApiDataStore().sync(response))
      .catch(this.handleError);
  }

  delete(attribute: AttributeTranslation): Promise<void> {
    const url = `${this.resourceUrl}/${attribute.resource.id}/translated-attributes/${attribute.id}`;

    return this.http
      .delete(url, this.authService.getAuthorizationAndOptions())
      .toPromise()
      .then(() => true)
      .catch(this.handleError);
  }
}
