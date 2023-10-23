import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { JsonApiDataStore } from 'jsonapi-datastore';
import { countries, ICountry } from 'countries-list';
import { AuthService } from '../auth/auth.service';
import {
  LanguageBCP47Service,
  LanguageBCP47,
} from '../../service/languages-bcp47-tag.service';
import { AbstractService } from '../abstract.service';
import { ToolGroup, RuleTypeEnum } from '../../models/tool-group';
import { environment } from '../../../environments/environment';

interface PraxisData {
  confidence: string[];
  openness: string[];
}
@Injectable()
export class ToolGroupService extends AbstractService {
  constructor(
    private http: Http,
    private authService: AuthService,
    private languageBCP47Service: LanguageBCP47Service,
  ) {
    super();
  }
  private readonly toolGroupsUrl = environment.base_url + 'tool-groups';

  praxisConfidentData = {
    0: {
      name: 'Very confident',
    },
    1: {
      name: 'Somewhat confident',
    },
    2: {
      name: 'Neutral',
    },
    3: {
      name: 'Not very confident',
    },
    4: {
      name: 'Not confident at all',
    },
  };

  praxisOpennessData = {
    0: {
      name: 'Very Open',
    },
    1: {
      name: 'Somewhat open',
    },
    2: {
      name: 'Neutral',
    },
    3: {
      name: 'Not very open or interested',
    },
    4: {
      name: 'Not open at all',
    },
  };

  getToolGroups(): Promise<ToolGroup[]> {
    return this.http
      .get(this.toolGroupsUrl, this.authService.getAuthorizationAndOptions())
      .toPromise()
      .then((response) => new JsonApiDataStore().sync(response.json()))
      .catch(this.handleError);
  }

  getToolGroup(
    id: number,
    include = 'rules-language,rules-praxis,rules-country,tools,tools.tool',
  ): Promise<ToolGroup> {
    return this.http
      .get(
        `${this.toolGroupsUrl}/${id}?include=${include}`,
        this.authService.getAuthorizationAndOptions(),
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

  deleteToolGroup(toolGroupId: number) {
    return this.http
      .delete(
        `${this.toolGroupsUrl}/${toolGroupId}`,
        this.authService.getAuthorizationAndOptions(),
      )
      .toPromise()
      .then(() => {
        return {
          status: 'success',
        };
      })
      .catch(this.handleError);
  }

  createOrUpdateRule(
    toolGroupId: number,
    ruleId: number,
    negativeRule: boolean,
    data: string[] | PraxisData,
    type: RuleTypeEnum,
  ) {
    const isUpdate = ruleId ? true : false;
    let dataType = '',
      attributes = {},
      url = '';

    switch (type) {
      case RuleTypeEnum.COUNTRY:
        dataType = 'tool-group-rules-country';
        attributes = {
          countries: data,
          'negative-rule': negativeRule,
        };
        url = `${this.toolGroupsUrl}/${toolGroupId}/rules-country`;
        break;
      case RuleTypeEnum.LANGUAGE:
        dataType = 'tool-group-rules-language';
        attributes = {
          languages: data,
          'negative-rule': negativeRule,
        };
        url = `${this.toolGroupsUrl}/${toolGroupId}/rules-language`;
        break;
      case RuleTypeEnum.PRAXIS:
        dataType = 'tool-group-rules-praxis';
        attributes = {
          ...data,
          'negative-rule': negativeRule,
        };
        url = `${this.toolGroupsUrl}/${toolGroupId}/rules-praxis`;
        break;
      default:
        return;
    }

    const payload = {
      data: {
        type: dataType,
        attributes,
      },
    };

    url += isUpdate ? `/${ruleId}` : '';

    if (isUpdate) {
      return this.http
        .put(url, payload, this.authService.getAuthorizationAndOptions())
        .toPromise()
        .then((response) => new JsonApiDataStore().sync(response.json()))
        .catch(this.handleError);
    } else {
      return this.http
        .post(url, payload, this.authService.getAuthorizationAndOptions())
        .toPromise()
        .then((response) => new JsonApiDataStore().sync(response.json()))
        .catch(this.handleError);
    }
  }

  deleteRule(toolGroupId: number, ruleId: number, type: RuleTypeEnum) {
    let url = '';
    switch (type) {
      case RuleTypeEnum.COUNTRY:
        url = `${this.toolGroupsUrl}/${toolGroupId}/rules-country/${ruleId}`;
        break;
      case RuleTypeEnum.LANGUAGE:
        url = `${this.toolGroupsUrl}/${toolGroupId}/rules-language/${ruleId}`;
        break;
      case RuleTypeEnum.PRAXIS:
        url = `${this.toolGroupsUrl}/${toolGroupId}/rules-praxis/${ruleId}`;
        break;
      default:
        return;
    }

    return this.http
      .delete(url, this.authService.getAuthorizationAndOptions())
      .toPromise()
      .then(() => {
        return {
          status: 'success',
        };
      })
      .catch(this.handleError);
  }

  getReadableValue(code: string, type: RuleTypeEnum): LanguageBCP47 | ICountry {
    if (type === RuleTypeEnum.LANGUAGE) {
      return this.languageBCP47Service.getLanguage(code);
    }
    if (type === RuleTypeEnum.COUNTRY) {
      return countries[code];
    }
  }

  addOrUpdateTool(
    toolGroupId: number,
    id: string,
    toolID: string,
    suggestionsWeight: string,
    isUpdate: boolean,
  ) {
    const payload = {
      data: {
        type: 'tool-group-tool',
        attributes: {
          'suggestions-weight': suggestionsWeight,
        },
        relationships: {
          tool: {
            data: {
              type: 'resource',
              id: toolID,
            },
          },
        },
      },
    };

    if (isUpdate) {
      return this.http
        .put(
          `${this.toolGroupsUrl}/${toolGroupId}/tools/${id}`,
          payload,
          this.authService.getAuthorizationAndOptions(),
        )
        .toPromise()
        .then((response) => new JsonApiDataStore().sync(response.json()))
        .catch(this.handleError);
    } else {
      return this.http
        .post(
          `${this.toolGroupsUrl}/${toolGroupId}/tools`,
          payload,
          this.authService.getAuthorizationAndOptions(),
        )
        .toPromise()
        .then((response) => new JsonApiDataStore().sync(response.json()))
        .catch(this.handleError);
    }
  }

  deleteTool(toolGroupId: number, id: string) {
    return this.http
      .delete(
        `${this.toolGroupsUrl}/${toolGroupId}/tools/${id}`,
        this.authService.getAuthorizationAndOptions(),
      )
      .toPromise()
      .then(() => {
        return {
          status: 'success',
        };
      })
      .catch(this.handleError);
  }
}
