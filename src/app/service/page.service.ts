import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JsonApiDataStore } from 'jsonapi-datastore';
import { environment } from '../../environments/environment';
import { Page } from '../models/page';
import { AbstractService } from './abstract.service';
import { AuthService } from './auth/auth.service';

@Injectable()
export class PageService extends AbstractService {
  private readonly pagesUrl = environment.base_url + 'pages';

  constructor(readonly http: HttpClient, readonly authService: AuthService) {
    super();
  }

  create(page: Page): Promise<Page> {
    const payload = {
      data: {
        id: page.id,
        type: 'page',
        attributes: {
          structure: page.structure,
          resource_id: page.resource.id,
          position: page.position,
          filename: page.filename,
        },
      },
    };

    return this.http
      .post(
        this.pagesUrl,
        payload,
        this.authService.getAuthorizationAndOptions(),
      )
      .toPromise()
      .then((response) => new JsonApiDataStore().sync(response))
      .catch(this.handleError);
  }

  update(pageId: number, structure: string): Promise<Page> {
    const url = `${this.pagesUrl}/${pageId}`;

    const payload = {
      data: {
        id: pageId,
        type: 'page',
        attributes: {
          structure: structure,
        },
      },
    };

    return this.http
      .put(url, payload, this.authService.getAuthorizationAndOptions())
      .toPromise()
      .then((response) => new JsonApiDataStore().sync(response))
      .catch(this.handleError);
  }
}
