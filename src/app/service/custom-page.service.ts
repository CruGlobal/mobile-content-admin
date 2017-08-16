import { Injectable } from '@angular/core';
import {Constants} from '../constants';
import {Http} from '@angular/http';
import {JsonApiDataStore} from 'jsonapi-datastore';
import {AuthService} from './auth.service';
import {CustomPage} from '../models/custom-page';

@Injectable()
export class CustomPageService {
  private readonly customPagesUrl = Constants.BASE_URL + 'custom_pages';

  constructor(private http: Http, private authService: AuthService) { }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred');
    return Promise.reject(error.message || error);
  }

  update(customPage: CustomPage): Promise<CustomPage> {
    const payload = {
      data: {
        id: customPage.id,
        type: 'custom_page',
        attributes: {
          language_id: customPage.language.id,
          page_id: customPage.page.id,
          structure: customPage.structure
        }
      }
    };

    return this.http.post(this.customPagesUrl, payload, this.authService.getHttpOptions())
      .toPromise()
      .then(response => new JsonApiDataStore().sync(response.json()))
      .catch(this.handleError);
  }
}
