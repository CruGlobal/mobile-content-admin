import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import {JsonApiDataStore} from 'jsonapi-datastore';
import {AuthService} from './auth.service';
import {CustomPage} from '../models/custom-page';
import {environment} from '../../environments/environment';

@Injectable()
export class CustomPageService {
  private readonly customPagesUrl = environment.base_url + 'custom_pages';

  constructor(private http: Http, private authService: AuthService) { }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred');
    return Promise.reject(error.message || error);
  }

  upsert(languageId: number, pageId: number, structure: string): Promise<CustomPage> {
    const payload = {
      data: {
        type: 'custom_page',
        attributes: {
          language_id: languageId,
          page_id: pageId,
          structure: structure
        }
      }
    };

    return this.http.post(this.customPagesUrl, payload, this.authService.getAuthorizationAndOptions())
      .toPromise()
      .then(response => new JsonApiDataStore().sync(response.json()))
      .catch(this.handleError);
  }
}
