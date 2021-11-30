import { Injectable } from '@angular/core';
import { Resource } from '../../models/resource';
import { Http } from '@angular/http';

import { JsonApiDataStore } from 'jsonapi-datastore';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../environments/environment';
import { AbstractService } from '../abstract.service';

@Injectable()
export class ResourceService extends AbstractService {
  private readonly resourcesUrl = environment.base_url + 'resources';

  constructor(private http: Http, private authService: AuthService) {
    super();
  }

  getResources(include: string): Promise<Resource[]> {
    return this.http
      .get(`${this.resourcesUrl}?include=${include}`)
      .toPromise()
      .then((response) => {
        return new JsonApiDataStore().sync(response.json());
      })
      .catch(this.handleError);
  }

  getResource(id: number, include: string): Promise<Resource> {
    const url = `${this.resourcesUrl}/${id}?include=${include}`;
    return this.http
      .get(url)
      .toPromise()
      .then(function (response) {
        return new JsonApiDataStore().sync(response.json());
      })
      .catch(this.handleError);
  }

  create(resource: Resource): Promise<Resource> {
    return this.http
      .post(
        this.resourcesUrl,
        this.getPayload(resource),
        this.authService.getAuthorizationAndOptions(),
      )
      .toPromise()
      .then((response) => new JsonApiDataStore().sync(response.json()))
      .catch(this.handleError);
  }

  update(resource: Resource): Promise<Resource> {
    return this.http
      .put(
        `${this.resourcesUrl}/${resource.id}`,
        this.getPayload(resource),
        this.authService.getAuthorizationAndOptions(),
      )
      .toPromise()
      .then(() => resource)
      .catch(this.handleError);
  }

  private getPayload(resource: Resource) {
    return {
      data: {
        id: resource.id,
        type: 'resource',
        attributes: {
          name: resource.name,
          abbreviation: resource.abbreviation,
          system_id: Resource.getSystemId(resource),
          resource_type_id: Resource.getResourceTypeId(resource),
          onesky_project_id: resource.oneskyProjectId,
          description: resource.description,
          manifest: resource.manifest,
          'attr-banner': resource.banner || null,
          'attr-banner-about': resource.bannerAbout || null,
          'attr-about-overview-video-youtube':
            resource.aboutOverviewVideoYoutube || null,
          'attr-category': resource['attr-category'] || null,
          'attr-default-order': resource['attr-default-order'] || null,
        },
      },
    };
  }
}
