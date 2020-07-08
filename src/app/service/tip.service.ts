import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import {Tip} from '../models/tip';
import {JsonApiDataStore} from 'jsonapi-datastore';
import {AuthService} from './auth/auth.service';
import {environment} from '../../environments/environment';
import {AbstractService} from './abstract.service';

@Injectable()
export class TipService extends AbstractService {
  private readonly tipsUrl = environment.base_url + 'tips';

  constructor(private http: Http, private authService: AuthService) {
    super();
  }

  create(tip: Tip): Promise<Tip> {
    const payload = {
      data: {
        id: tip.id,
        type: 'tip',
        attributes: {
          structure: tip.structure,
          resource_id: tip.resource.id,
          position: tip.position,
          name: tip.name
        }
      }
    };

    return this.http.post(this.tipsUrl, payload, this.authService.getAuthorizationAndOptions())
      .toPromise()
      .then(response => new JsonApiDataStore().sync(response.json()))
      .catch(response => Promise.reject(response.json().errors));
  }

  update(tipId: number, structure: string): Promise<Tip> {
    const url = `${this.tipsUrl}/${tipId}`;

    const payload = {
      data: {
        id: tipId,
        type: 'tip',
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
