import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JsonApiDataStore } from 'jsonapi-datastore';
import { environment } from '../../environments/environment';
import { CustomTip } from '../models/custom-tip';
import { AbstractService } from './abstract.service';
import { AuthService } from './auth/auth.service';

// not sure why this is required here but not in custom-page.service.ts
// without it, there's a StaticInjectorError
@Injectable({
  providedIn: 'root',
})
export class CustomTipService extends AbstractService {
  private readonly customTipsUrl = environment.base_url + 'custom_tips';

  constructor(readonly http: HttpClient, readonly authService: AuthService) {
    super();
  }

  upsert(
    languageId: number,
    tipId: number,
    structure: string,
  ): Promise<CustomTip> {
    const payload = {
      data: {
        type: 'custom_tip',
        attributes: {
          language_id: languageId,
          tip_id: tipId,
          structure: structure,
        },
      },
    };

    return this.http
      .post(
        this.customTipsUrl,
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
        `${this.customTipsUrl}/${id}`,
        this.authService.getAuthorizationAndOptions(),
      )
      .toPromise()
      .catch(this.handleError);
  }
}
