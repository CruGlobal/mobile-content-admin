import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JsonApiDataStore } from 'jsonapi-datastore';
import { AuthService } from './auth/auth.service';
import { environment } from '../../environments/environment';
import { AbstractService } from './abstract.service';
import { CustomManifest } from '../models/custom-manifest';

@Injectable()
export class CustomManifestService extends AbstractService {
  private readonly customManifestsUrl =
    environment.base_url + 'custom_manifests';

  constructor(readonly http: HttpClient, readonly authService: AuthService) {
    super();
  }

  upsert(customManifest: CustomManifest): Promise<CustomManifest> {
    const payload = {
      data: {
        type: 'custom_manifest',
        attributes: {
          language_id: customManifest.language.id,
          resource_id: customManifest.resource.id,
          structure: customManifest.structure,
        },
      },
    };

    return this.http
      .post(
        this.customManifestsUrl,
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
        `${this.customManifestsUrl}/${id}`,
        this.authService.getAuthorizationAndOptions(),
      )
      .toPromise()
      .catch(this.handleError);
  }
}
