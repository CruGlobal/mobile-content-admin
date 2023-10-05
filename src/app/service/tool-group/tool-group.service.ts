import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ToolGroup } from '../../models/tool-group';
import { Language } from '../../models/language';
import { AuthService } from '../auth/auth.service';
import { JsonApiDataStore } from 'jsonapi-datastore';
import { environment } from '../../../environments/environment';
import { AbstractService } from '../abstract.service';

export enum createRuleTypeEnum {
  COUNTRY = 'country',
  LANGUAGE = 'language',
}

@Injectable()
export class ToolGroupService extends AbstractService {
  private readonly toolGroupsUrl = environment.base_url + 'tool-groups';

  constructor(private http: Http, private authService: AuthService) {
    super();
  }

  getToolGroups(): Promise<ToolGroup[]> {
    return this.http
      .get(
        this.toolGroupsUrl,
        this.authService.getAuthorizationAndOptions()
      )
      .toPromise()
      .then((response) => new JsonApiDataStore().sync(response.json()))
      .catch(this.handleError);
  }

  getToolGroup(id: number, include: string): Promise<Language> {
    return this.http
      .get(
        `${this.toolGroupsUrl}/${id}?include=${include}`,
        this.authService.getAuthorizationAndOptions()
      )
      .toPromise()
      .then((response) => new JsonApiDataStore().sync(response.json()))
      .catch(this.handleError);
  }

  createToolGroup(toolGroup: ToolGroup): Promise<ToolGroup> {
    const payload = {
      data: {
        type: 'tool-group',
        attributes: {
          name: toolGroup.name,
          suggestions_weight: toolGroup.suggestedWeight,
        },
      },
    };
    return this.http
      .post(
        this.toolGroupsUrl,
        payload,
        this.authService.getAuthorizationAndOptions(),
      )
      .toPromise()
      .then((response) => new JsonApiDataStore().sync(response.json()))
      .catch(this.handleError);
  }

  createRule(
    toolGroupId: number,
    negativeRule: boolean,
    data: any,
    type: createRuleTypeEnum,
  ) {
    let dataType = '', attributes = {}, url = '';
    switch(type) {
      case createRuleTypeEnum.COUNTRY:
        dataType = 'tool-group-rules-country';
        attributes = {
          countries: data,
          'negative-rule': negativeRule,
        }
        url = `${this.toolGroupsUrl}/${toolGroupId}/rules-country`;
        break;
      case createRuleTypeEnum.LANGUAGE:
        dataType = 'tool-group-rules-language';
        attributes = {
          languages: data,
          'negative-rule': negativeRule,
        }
        url = `${this.toolGroupsUrl}/${toolGroupId}/rules-language`;
        break;
      default:
        return
    }

    const payload = {
      data: {
        type: dataType,
        attributes
      }
    }

    return this.http
      .post(
        url,
        payload,
        this.authService.getAuthorizationAndOptions(),
      )
      .toPromise()
      .then((response) => new JsonApiDataStore().sync(response.json()))
      .catch(this.handleError);
  }
}
