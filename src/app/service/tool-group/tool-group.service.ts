import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ToolGroup, RuleTypeEnum } from '../../models/tool-group';
import { AuthService } from '../auth/auth.service';
import { JsonApiDataStore } from 'jsonapi-datastore';
import { environment } from '../../../environments/environment';
import { AbstractService } from '../abstract.service';
import { LanguageBCP47Service, LanguageBCP47 } from '../../service/languages-bcp47-tag.service';
import { countries, ICountry } from 'countries-list'

@Injectable()
export class ToolGroupService extends AbstractService {
  private readonly toolGroupsUrl = environment.base_url + 'tool-groups';

  constructor(
    private http: Http,
    private authService: AuthService,
    private languageBCP47Service: LanguageBCP47Service,
  ) {
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

  getToolGroup(id: number, include = 'rules-language,rules-praxis,rules-country'): Promise<ToolGroup> {
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


  deleteToolGroup(
    toolGroupId: number,
  ) {
    return this.http
      .delete(
        `${this.toolGroupsUrl}/${toolGroupId}`,
        this.authService.getAuthorizationAndOptions(),
      )
      .toPromise()
      .then(() => {
        return {
          status: 'success'
        }
      })
      .catch(this.handleError);
  }



  createOrUpdateRule(
    toolGroupId: number,
    ruleId: number,
    negativeRule: boolean,
    data: string[],
    type: RuleTypeEnum,
  ) {
    const isUpdate = (ruleId) ? true : false;
    let dataType = '', attributes = {}, url = '';

    switch(type) {
      case RuleTypeEnum.COUNTRY:
        dataType = 'tool-group-rules-country';
        attributes = {
          countries: data,
          'negative-rule': negativeRule,
        }
        url = `${this.toolGroupsUrl}/${toolGroupId}/rules-country`;
        break;
      case RuleTypeEnum.LANGUAGE:
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

    url += isUpdate ? `/${ruleId}` : '';

    if (isUpdate) {
      return this.http.put(
          url,
          payload,
          this.authService.getAuthorizationAndOptions(),
        )
        .toPromise()
        .then((response) => new JsonApiDataStore().sync(response.json()))
        .catch(this.handleError);
    } else {
      return this.http.post(
        url,
        payload,
        this.authService.getAuthorizationAndOptions(),
      )
      .toPromise()
      .then((response) => new JsonApiDataStore().sync(response.json()))
      .catch(this.handleError);
    }
  }

  deleteRule(
    toolGroupId: number,
    ruleId: number,
    type: RuleTypeEnum,
  ) {
    let url = '';
    switch(type) {
      case RuleTypeEnum.COUNTRY:
        url = `${this.toolGroupsUrl}/${toolGroupId}/rules-country/${ruleId}`;
        break;
      case RuleTypeEnum.LANGUAGE:
        url = `${this.toolGroupsUrl}/${toolGroupId}/rules-language/${ruleId}`;
        break;
      default:
        return
    }

    return this.http
      .delete(
        url,
        this.authService.getAuthorizationAndOptions(),
      )
      .toPromise()
      .then(() => {
        return {
          status: 'success'
        }
      })
      .catch(this.handleError);
  }

  getReadableValue(code: string, type: RuleTypeEnum): LanguageBCP47 | ICountry {
    if (type === RuleTypeEnum.LANGUAGE) {
      return this.languageBCP47Service.getLanguage(code);
    }
    if (type === RuleTypeEnum.COUNTRY) {
      return countries[code]
    }
  }
}
