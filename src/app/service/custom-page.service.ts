import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JsonApiDataStore } from 'jsonapi-datastore';
import { environment } from '../../environments/environment';
import { CustomPage } from '../models/custom-page';
import { AbstractService } from './abstract.service';
import { AuthService } from './auth/auth.service';

@Injectable()
export class CustomPageService extends AbstractService {
  private readonly customPagesUrl = environment.base_url + 'custom_pages';

  constructor(readonly http: HttpClient, readonly authService: AuthService) {
    super();
  }

  upsert(
    languageId: number,
    pageId: number,
    structure: string,
  ): Promise<CustomPage> {
    const payload = {
      data: {
        type: 'custom_page',
        attributes: {
          language_id: languageId,
          page_id: pageId,
          structure: structure,
        },
      },
    };

    return this.http
      .post(
        this.customPagesUrl,
        payload,
        this.authService.getAuthorizationAndOptions(),
      )
      .toPromise()
      .then((response) => new JsonApiDataStore().sync(response))
      .catch(this.handleError);
  }

  delete(id: number): Promise<void> {
    return this.http
      .delete(
        `${this.customPagesUrl}/${id}`,
        this.authService.getAuthorizationAndOptions(),
      )
      .toPromise()
      .catch(this.handleError);
  }
}
