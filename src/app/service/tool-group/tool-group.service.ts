import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JsonApiDataStore } from 'jsonapi-datastore';
import { environment } from '../../../environments/environment';
import { Resource } from '../../models/resource';
import {
  ToolGroup,
  RuleTypeEnum,
  ToolGroupRule,
} from '../../models/tool-group';
import { AbstractService } from '../abstract.service';
import { AuthService } from '../auth/auth.service';

interface PraxisData {
  confidence: string[];
  openness: string[];
}
@Injectable()
export class ToolGroupService extends AbstractService {
  constructor(readonly http: HttpClient, readonly authService: AuthService) {
    super();
  }
  private readonly toolGroupsUrl = environment.base_url + 'tool-groups';

  praxisConfidentData = {
    1: {
      name: 'Very confident',
    },
    2: {
      name: 'Somewhat confident',
    },
    3: {
      name: 'Neutral',
    },
    4: {
      name: 'Not very confident',
    },
    5: {
      name: 'Not confident at all',
    },
  };

  praxisOpennessData = {
    1: {
      name: 'Very Open',
    },
    2: {
      name: 'Somewhat open',
    },
    3: {
      name: 'Neutral',
    },
    4: {
      name: 'Not very open or interested',
    },
    5: {
      name: 'Not open at all',
    },
  };

  getToolGroups(): Promise<ToolGroup[]> {
    return this.http
      .get(this.toolGroupsUrl, this.authService.getAuthorizationAndOptions())
      .toPromise()
      .then((response) => new JsonApiDataStore().sync(response))
      .catch(this.handleError);
  }

  getToolGroup(
    id: number,
    include = 'rules-language,rules-praxis,rules-country,tools.tool',
  ): Promise<ToolGroup> {
    return this.http
      .get(
        `${this.toolGroupsUrl}/${id}?include=${include}`,
        this.authService.getAuthorizationAndOptions(),
      )
      .toPromise()
      .then((response) => new JsonApiDataStore().sync(response))
      .catch(this.handleError);
  }

  createOrUpdateToolGroup(
    toolGroup: ToolGroup,
    isUpdate: boolean,
  ): Promise<ToolGroup> {
    const payload = {
      data: {
        type: 'tool-group',
        attributes: {
          name: toolGroup.name,
          suggestions_weight: toolGroup.suggestedWeight,
        },
      },
    };

    if (isUpdate) {
      return this.http
        .put(
          `${this.toolGroupsUrl}/${toolGroup.id}`,
          payload,
          this.authService.getAuthorizationAndOptions(),
        )
        .toPromise()
        .then((response) => new JsonApiDataStore().sync(response))
        .catch(this.handleError);
    }
    return this.http
      .post(
        this.toolGroupsUrl,
        payload,
        this.authService.getAuthorizationAndOptions(),
      )
      .toPromise()
      .then((response) => new JsonApiDataStore().sync(response))
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
        .then((response) => new JsonApiDataStore().sync(response))
        .catch(this.handleError);
    }
    return this.http
      .post(url, payload, this.authService.getAuthorizationAndOptions())
      .toPromise()
      .then((response) => new JsonApiDataStore().sync(response))
      .catch(this.handleError);
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
          'suggestions-weight': suggestionsWeight || '1.0',
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
        .then((response) => new JsonApiDataStore().sync(response))
        .catch(this.handleError);
    } else {
      return this.http
        .post(
          `${this.toolGroupsUrl}/${toolGroupId}/tools`,
          payload,
          this.authService.getAuthorizationAndOptions(),
        )
        .toPromise()
        .then((response) => new JsonApiDataStore().sync(response))
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

  getToolGroupSuggestions(
    countryRule: ToolGroupRule,
    languageRule: ToolGroupRule,
    praxisRule: ToolGroupRule,
  ): Promise<Resource[]> {
    let filter = '';
    const languages = languageRule.languages;
    const countries = countryRule.countries;
    const confidence = praxisRule.confidence;
    const openness = praxisRule.openness;

    const createFilters = (items: string | string[], filterString) => {
      if (!items) {
        return;
      }
      if (Array.isArray(items)) {
        const filters = items.reduce(
          (result: string, currentItem: string) =>
            result + `${filterString}=${currentItem}&`,
          '',
        );
        filter += filters;
      } else {
        filter += `${filterString}=${items}&`;
      }
    };

    createFilters(countries, 'filter[country]');
    createFilters(languages, 'filter[language][]');
    createFilters(confidence, 'filter[confidence]');
    createFilters(openness, 'filter[openness]');

    // Remove last "&" from string.
    filter = filter.slice(0, -1);
    return this.http
      .get(
        `${environment.base_url}resources/suggestions?${filter}`,
        this.authService.getAuthorizationAndOptions(),
      )
      .toPromise()
      .then((response) => new JsonApiDataStore().sync(response))
      .catch(this.handleError);
  }
}
