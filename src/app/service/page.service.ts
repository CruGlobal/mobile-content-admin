import { Injectable } from '@angular/core';
import {Constants} from '../constants';
import {Http} from '@angular/http';
import {Page} from '../models/page';
import {JsonApiDataStore} from 'jsonapi-datastore';
import {AuthService} from './auth.service';

@Injectable()
export class PageService {
  private readonly pagesUrl = Constants.BASE_URL + 'pages';

  constructor(private http: Http, private authService: AuthService) { }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred');
    return Promise.reject(error.message || error);
  }

  update(page: Page): Promise<Page> {
    const url = `${this.pagesUrl}/${page.id}`;

    const payload = {
      data: {
        id: page.id,
        type: 'page',
        attributes: {
          structure: page.structure
        }
      }
    };

    return this.http.put(url, payload, this.authService.getHttpOptions())
      .toPromise()
      .then(response => new JsonApiDataStore().sync(response.json()))
      .catch(this.handleError);
  }
}
