import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AttributeTranslation } from '../models/attribute-translation';
import { JsonApiDataStore } from 'jsonapi-datastore';
import { AuthService } from './auth/auth.service';
import { environment } from '../../environments/environment';
import { AbstractService } from './abstract.service';
import { Resource } from '../models/resource';

@Injectable()
export class AttributeTranslationService extends AbstractService {
  private readonly resourceUrl = environment.base_url + 'resources';

  constructor(private http: Http, private authService: AuthService) {
    super();
  }

  getAttributes(resourceId: Number): Promise<Resource> {
    const url = `${this.resourceUrl}/${resourceId}?include=translated-attributes`;
    return this.http
      .get( url, this.authService.getAuthorizationAndOptions() )
      .toPromise()
      .then((response) => new JsonApiDataStore().sync(response.json()))
      .catch(this.handleError);
  }

  create(resourceId: Number, attribute: AttributeTranslation): Promise<AttributeTranslation> {
    const url = `${this.resourceUrl}/${resourceId}/translated-attributes`;

    const payload = {
      data: {
        type: 'translated-attribute',
        attributes: {
            key: attribute.key,
            'onesky-phrase-id': attribute['onesky-phrase-id'],
            required: attribute.required
        },
      },
    };

    return this.http
      .post( url, payload, this.authService.getAuthorizationAndOptions() )
      .toPromise()
      .then((response) => new JsonApiDataStore().sync(response.json()))
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
            'onesky-phrase-id': attribute['onesky-phrase-id'],
            required: attribute.required
        },
      },
    };

    return this.http
      .put(url, payload, this.authService.getAuthorizationAndOptions())
      .toPromise()
      .then((response) => new JsonApiDataStore().sync(response.json()))
      .catch(this.handleError);
  }

  delete(attribute: AttributeTranslation): Promise<void> {
    const url = `${this.resourceUrl}/${attribute.resource.id}/translated-attributes/${attribute.id}`;
    console.log('delete url', url)
    return this.http
      .delete(url, this.authService.getAuthorizationAndOptions())
      .toPromise()
      .then(() => true)
      .catch(this.handleError);
  }
}
