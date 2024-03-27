import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Translation } from '../models/translation';
import { AuthService } from './auth/auth.service';
import { JsonApiDataStore } from 'jsonapi-datastore';
import { Page } from '../models/page';
import { Tip } from '../models/tip';
import { environment } from '../../environments/environment';
import { AbstractService } from './abstract.service';

@Injectable()
export class DraftService extends AbstractService {
  private readonly draftsUrl = environment.base_url + 'drafts';

  constructor(private http: Http, private authService: AuthService) {
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
      .get(
        `${this.draftsUrl}/${translation.id}/?page_id=${page.id}`,
        this.authService.getAuthorizationAndOptions(),
      )
      .toPromise()
      .then((response) => {
        return response.text();
      })
      .catch(this.handleError);
  }

  getTip(tip: Tip, translation: Translation): Promise<string> {
    return this.http
      .get(
        `${this.draftsUrl}/${translation.id}/?tip_id=${tip.id}`,
        this.authService.getAuthorizationAndOptions(),
      )
      .toPromise()
      .then((response) => {
        return response.text();
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

  updateDraft(translation: Translation): Promise<Translation> {
    const payload = {
      data: {
        type: 'translation',
        attributes: {
          is_published: translation.is_published,
        },
      },
    };

    return this.http
      .put(
        `${this.draftsUrl}/${translation.id}`,
        payload,
        this.authService.getAuthorizationAndOptions(),
      )
      .toPromise()
      .then((response) => new JsonApiDataStore().sync(response.json()))
      .catch(this.handleError);
  }
}
