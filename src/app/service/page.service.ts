import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import {Page} from '../models/page';
import {JsonApiDataStore} from 'jsonapi-datastore';
import {AuthService} from './auth.service';
import {environment} from '../../environments/environment';

@Injectable()
export class PageService {
  private readonly pagesUrl = environment.base_url + 'pages';

  constructor(private http: Http, private authService: AuthService) { }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred');
    return Promise.reject(error.json().errors);
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
          filename: page.filename
        }
      }
    };

    return this.http.post(this.pagesUrl, payload, this.authService.getAuthorizationAndOptions())
      .toPromise()
      .then(response => new JsonApiDataStore().sync(response.json()))
      .catch(response => Promise.reject(response.json().errors));
  }

  update(pageId: number, structure: string): Promise<Page> {
    const url = `${this.pagesUrl}/${pageId}`;

    const payload = {
      data: {
        id: pageId,
        type: 'page',
        attributes: {
          structure: structure
        }
      }
    };

    return this.http.put(url, payload, this.authService.getAuthorizationAndOptions())
      .toPromise()
      .then(response => new JsonApiDataStore().sync(response.json()))
      .catch(this.handleError);
  }
}
