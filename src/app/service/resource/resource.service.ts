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

  getResources(include?: string): Promise<Resource[]> {
    return this.http
      .get(
        include ? `${this.resourcesUrl}?include=${include}` : this.resourcesUrl,
      )
      .toPromise()
      .then((response) => {
        return new JsonApiDataStore().sync(response.json());
      })
      .catch(this.handleError);
  }

  getResource(resourceId: number, include?: string): Promise<Resource> {
    return this.http
      .get(
        include
          ? `${this.resourcesUrl}/${resourceId}?include=${include}`
          : `${this.resourcesUrl}/${resourceId}`,
      )
      .toPromise()
      .then((response) => {
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
          metatool_id: (resource.metatool && resource.metatool.id) || null,
          default_variant_id:
            (resource['default-variant'] && resource['default-variant'].id) ||
            null,
          onesky_project_id: resource.oneskyProjectId,
          description: resource.description,
          manifest: resource.manifest,
          'attr-banner': resource.banner || null,
          'attr-banner-about': resource.bannerAbout || null,
          'attr-about-banner-animation':
            resource['attr-about-banner-animation'] || null,
          'attr-about-overview-video-youtube':
            resource.aboutOverviewVideoYoutube || null,
          'attr-category': resource['attr-category'] || null,
          'attr-default-order': resource['attr-default-order'] || null,
          'attr-hidden': resource['attr-hidden'] || null,
          'attr-spotlight': resource['attr-spotlight'] || null,
        },
      },
    };
  }
}
