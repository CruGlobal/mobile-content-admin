import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {Language} from '../models/language';
import {Constants} from '../constants';
import {AuthService} from './auth.service';

@Injectable()
export class LanguageService {
  private readonly languagesUrl = Constants.BASE_URL + 'languages';

  constructor(private http: Http, private authService: AuthService) {}

  private handleError(error: any): Promise<any> {
    console.error('An error occurred');
    return Promise.reject(error.message || error);
  }

  getLanguages(): Promise<Language[]> {
    return this.http.get(this.languagesUrl)
      .toPromise()
      .then(response => response.json().data as Language[])
      .catch(this.handleError);
  }
  getLanguage(id: number): Promise<Language> {
    return this.http.get(`${this.languagesUrl}/${id}`)
      .toPromise()
      .then(response => response.json().data as Language)
      .catch(this.handleError);
  }
  createLanguage(language: Language): Promise<Language> {
    const body = `{"data": {"attributes": {"name":"${language.name}", "code":"${language.code}"}}}`;

    return this.http.post(this.languagesUrl, body, this.authService.getHttpOptions())
      .toPromise()
      .then(response => response.json().data as Language)
      .catch(this.handleError);
  }
}
