import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Translation} from '../models/translation';
import {Constants} from '../constants';
import {AuthService} from './auth.service';
import {JsonApiDataStore} from 'jsonapi-datastore';

@Injectable()
export class DraftService {
  private readonly draftsUrl = Constants.BASE_URL + 'drafts';

  constructor(private http: Http, private authService: AuthService) { }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred');
    return Promise.reject(error.message || error);
  }

  createDraft(resourceId: number, languageId: number): Promise<Translation> {
    const body = `{"data": {"attributes": {"resource_id": ${resourceId}, "language_id": ${languageId}}}}`;

    return this.http.post(this.draftsUrl, body, this.authService.getHttpOptions())
      .toPromise()
      .then(response => new JsonApiDataStore().sync(response.json()))
      .catch(this.handleError);
  }
}
