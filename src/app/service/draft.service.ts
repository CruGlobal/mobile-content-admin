import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JsonApiDataStore } from 'jsonapi-datastore';
import { environment } from '../../environments/environment';
import { Page } from '../models/page';
import { Resource } from '../models/resource';
import { Tip } from '../models/tip';
import { Translation } from '../models/translation';
import { AbstractService } from './abstract.service';
import { AuthService } from './auth/auth.service';

@Injectable()
export class DraftService extends AbstractService {
  private readonly draftsUrl = environment.base_url + 'drafts';
  private readonly resourcesUrl = environment.base_url + 'resources';

  constructor(readonly http: HttpClient, readonly authService: AuthService) {
    super();
  }

  canGetDrafts(): Promise<boolean> {
    return this.http
      .get(this.draftsUrl, this.authService.getAuthorizationAndOptions())
      .toPromise()
      .then(() => true)
      .catch(() => Promise.reject(false));
  }

  getPage(page: Page, translation: Translation): Promise<string> {
    return this.http
      .get(`${this.draftsUrl}/${translation.id}/?page_id=${page.id}`, {
        ...this.authService.getAuthorizationAndOptions(),
        responseType: 'text',
      })
      .toPromise()
      .then((response) => {
        return response;
      })
      .catch(this.handleError);
  }

  getTip(tip: Tip, translation: Translation): Promise<string> {
    return this.http
      .get(`${this.draftsUrl}/${translation.id}/?tip_id=${tip.id}`, {
        ...this.authService.getAuthorizationAndOptions(),
        responseType: 'text',
      })
      .toPromise()
      .then((response) => {
        return response;
      })
      .catch(this.handleError);
  }

  createDraft(translation: Translation): Promise<void> {
    const body = `{"data": {"attributes": {"resource_id": ${translation.resource.id}, "language_id": ${translation.language.id}}}}`;

    return this.http
      .post(this.draftsUrl, body, this.authService.getAuthorizationAndOptions())
      .toPromise()
      .catch(this.handleError);
  }

  publishDraft(
    resource: Resource,
    translation: Translation,
  ): Promise<Translation> {
    const payload = {
      data: {
        type: 'publish-translations',
        relationships: {
          languages: {
            data: [
              {
                id: translation.language.id,
                type: 'language',
              },
            ],
          },
        },
      },
    };

    return this.http
      .post(
        `${this.resourcesUrl}/${resource.id}/translations/publish`,
        payload,
        this.authService.getAuthorizationAndOptions(),
      )
      .toPromise()
      .then((response) => new JsonApiDataStore().sync(response))
      .catch(this.handleError);
  }
}
