import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { ToolGroupService } from './tool-group.service';
import { AuthService } from '../auth/auth.service';
import {
  ToolGroup,
  RuleTypeEnum,
  ToolGroupRule,
} from '../../models/tool-group';
import { environment } from '../../../environments/environment';

const headers = { headers: new HttpHeaders() };
const toolGroupsUrl = environment.base_url + 'tool-groups';

class MockHttpClient {
  get() {
    return Observable.create((observer) => {
      observer.next(new ToolGroup());
      observer.complete();
    });
  }
  
  post() {
    return Observable.create((observer) => {
      observer.next(new ToolGroup());
      observer.complete();
    });
  }
  
  put() {
    return Observable.create((observer) => observer.complete());
  }
  
  delete() {
    return Observable.create((observer) => observer.complete());
  }
}

class MockAuthService extends AuthService {
  getAuthorizationAndOptions() {
    return headers;
  }
}

describe('ToolGroupService', () => {
  const mockHttp = new MockHttpClient();
  const mockAuthService = new MockAuthService(null, null);
  const service = new ToolGroupService(mockHttp as any, mockAuthService as any);

  const toolGroup = new ToolGroup();

  describe('Get Single Tool Group', () => {
    beforeEach(() => {
      spyOn(mockHttp, 'get').and.returnValue(
        Observable.create((observer) => {
          observer.next({
            json() {
              return toolGroup;
            },
          });
          observer.complete();
        }),
      );
    });

    it('should fetch a single toolGroup', () => {
      const id = 7;
      service.getToolGroup(id);
      expect(mockHttp.get).toHaveBeenCalledWith(
        `${toolGroupsUrl}/${id}?include=rules-language,rules-praxis,rules-country,tools.tool`,
        headers,
      );
    });

    it('should return tool group with only languages', () => {
      const id = 8;
      const includes = 'rules-language,rules-country';
      service.getToolGroup(id, includes);
      expect(mockHttp.get).toHaveBeenCalledWith(
        `${toolGroupsUrl}/${id}?include=${includes}`,
        headers,
      );
    });
  });

  describe('Get all Tool Groups', () => {
    beforeEach(() => {
      spyOn(mockHttp, 'get').and.returnValue(
        Observable.create((observer) => {
          observer.next({
            json() {
              return [toolGroup, toolGroup];
            },
          });
          observer.complete();
        }),
      );
    });

    it('should fetch all toolGroups', () => {
      service.getToolGroups();
      expect(mockHttp.get).toHaveBeenCalledWith(`${toolGroupsUrl}`, headers);
    });
  });

  describe('Create/Edit/Delete Tool Groups', () => {
    beforeEach(() => {
      spyOn(mockHttp, 'post').and.returnValue(
        Observable.create((observer) => {
          observer.next({
            json() {
              return toolGroup;
            },
          });
          observer.complete();
        }),
      );
      spyOn(mockHttp, 'put').and.returnValue(
        Observable.create((observer) => {
          observer.next({
            json() {
              return toolGroup;
            },
          });
          observer.complete();
        }),
      );
      spyOn(mockHttp, 'delete').and.returnValue(
        Observable.create((observer) => {
          observer.next({
            json() {
              return {
                status: 'success',
              };
            },
          });
          observer.complete();
        }),
      );
    });

    it('should create a toolGroup', () => {
      const newToolGroup = new ToolGroup();
      newToolGroup.name = 'New Tool Group';
      newToolGroup.suggestedWeight = '12';
      service.createOrUpdateToolGroup(newToolGroup, false);

      expect(mockHttp.post).toHaveBeenCalledWith(
        toolGroupsUrl,
        {
          data: {
            type: 'tool-group',
            attributes: {
              name: newToolGroup.name,
              suggestions_weight: newToolGroup.suggestedWeight,
            },
          },
        },
        headers,
      );
    });

    it('should edit a toolGroup', () => {
      const newToolGroup = new ToolGroup();
      newToolGroup.id = 8;
      newToolGroup.name = 'New Tool Group';
      newToolGroup.suggestedWeight = '12';
      service.createOrUpdateToolGroup(newToolGroup, true);

      expect(mockHttp.put).toHaveBeenCalledWith(
        `${toolGroupsUrl}/${newToolGroup.id}`,
        {
          data: {
            type: 'tool-group',
            attributes: {
              name: newToolGroup.name,
              suggestions_weight: newToolGroup.suggestedWeight,
            },
          },
        },
        headers,
      );
    });

    it('should delete a toolGroup', () => {
      const id = 8;
      service.deleteToolGroup(id);

      expect(mockHttp.delete).toHaveBeenCalledWith(
        `${toolGroupsUrl}/${id}`,
        headers,
      );
    });
  });

  describe('Create/Edit/Delete Rules', () => {
    const rule = new ToolGroupRule();

    beforeEach(() => {
      spyOn(mockHttp, 'post').and.returnValue(
        Observable.create((observer) => {
          observer.next({
            json() {
              return rule;
            },
          });
          observer.complete();
        }),
      );
      spyOn(mockHttp, 'put').and.returnValue(
        Observable.create((observer) => {
          observer.next({
            json() {
              return rule;
            },
          });
          observer.complete();
        }),
      );
      spyOn(mockHttp, 'delete').and.returnValue(
        Observable.create((observer) => {
          observer.next({
            json() {
              return {
                status: 'success',
              };
            },
          });
          observer.complete();
        }),
      );
    });

    const toolGroupId = 8;
    const ruleId = 1;

    it('should create a Country Rule', () => {
      const negativeRule = false;
      const data = ['string', 'string2'];
      const type = 'country';

      service.createOrUpdateRule(
        toolGroupId,
        null,
        negativeRule,
        data,
        type as RuleTypeEnum.COUNTRY,
      );

      expect(mockHttp.post).toHaveBeenCalledWith(
        `${toolGroupsUrl}/${toolGroupId}/rules-country`,
        {
          data: {
            type: 'tool-group-rules-country',
            attributes: {
              countries: data,
              'negative-rule': negativeRule,
            },
          },
        },
        headers,
      );
    });

    it('should create a Praxis Rule', () => {
      const negativeRule = true;
      const data = {
        confidence: ['1', '5'],
        openness: ['3', '0'],
      };
      const type = 'praxis';

      service.createOrUpdateRule(
        toolGroupId,
        null,
        negativeRule,
        data,
        type as RuleTypeEnum.PRAXIS,
      );

      expect(mockHttp.post).toHaveBeenCalledWith(
        `${toolGroupsUrl}/${toolGroupId}/rules-praxis`,
        {
          data: {
            type: 'tool-group-rules-praxis',
            attributes: {
              ...data,
              'negative-rule': negativeRule,
            },
          },
        },
        headers,
      );
    });

    it('should edit a Language Rule', () => {
      const negativeRule = true;
      const data = ['string', 'string2'];
      const type = 'language';

      service.createOrUpdateRule(
        toolGroupId,
        ruleId,
        negativeRule,
        data,
        type as RuleTypeEnum.LANGUAGE,
      );

      expect(mockHttp.put).toHaveBeenCalledWith(
        `${toolGroupsUrl}/${toolGroupId}/rules-language/${ruleId}`,
        {
          data: {
            type: 'tool-group-rules-language',
            attributes: {
              languages: data,
              'negative-rule': negativeRule,
            },
          },
        },
        headers,
      );
    });

    it('should delete a country rule', () => {
      service.deleteRule(
        toolGroupId,
        ruleId,
        'country' as RuleTypeEnum.COUNTRY,
      );
      expect(mockHttp.delete).toHaveBeenCalledWith(
        `${toolGroupsUrl}/${toolGroupId}/rules-country/${ruleId}`,
        headers,
      );
    });
    it('should delete a praxis rule', () => {
      service.deleteRule(toolGroupId, ruleId, 'praxis' as RuleTypeEnum.PRAXIS);
      expect(mockHttp.delete).toHaveBeenCalledWith(
        `${toolGroupsUrl}/${toolGroupId}/rules-praxis/${ruleId}`,
        headers,
      );
    });
    it('should delete a language rule', () => {
      service.deleteRule(
        toolGroupId,
        ruleId,
        'language' as RuleTypeEnum.LANGUAGE,
      );
      expect(mockHttp.delete).toHaveBeenCalledWith(
        `${toolGroupsUrl}/${toolGroupId}/rules-language/${ruleId}`,
        headers,
      );
    });
  });

  describe('Create/Edit/Delete Tools', () => {
    const tool = {
      id: '1',
      suggestionsWeight: 2.5,
    };

    beforeEach(() => {
      spyOn(mockHttp, 'post').and.returnValue(
        Observable.create((observer) => {
          observer.next({
            json() {
              return tool;
            },
          });
          observer.complete();
        }),
      );
      spyOn(mockHttp, 'put').and.returnValue(
        Observable.create((observer) => {
          observer.next({
            json() {
              return tool;
            },
          });
          observer.complete();
        }),
      );
      spyOn(mockHttp, 'delete').and.returnValue(
        Observable.create((observer) => {
          observer.next({
            json() {
              return {
                status: 'success',
              };
            },
          });
          observer.complete();
        }),
      );
    });

    const toolGroupId = 8;
    const id = '1';
    const toolId = '1';

    it('should create a Tool', () => {
      const suggestionsWeight = '2.0';
      const isUpdate = false;

      service.addOrUpdateTool(
        toolGroupId,
        null,
        toolId,
        suggestionsWeight,
        isUpdate,
      );

      expect(mockHttp.post).toHaveBeenCalledWith(
        `${toolGroupsUrl}/${toolGroupId}/tools`,
        {
          data: {
            type: 'tool-group-tool',
            attributes: {
              'suggestions-weight': suggestionsWeight,
            },
            relationships: {
              tool: {
                data: {
                  type: 'resource',
                  id: toolId,
                },
              },
            },
          },
        },
        headers,
      );
    });

    it('should edit a Tool', () => {
      const suggestionsWeight = '2.0';
      const isUpdate = true;

      service.addOrUpdateTool(
        toolGroupId,
        id,
        toolId,
        suggestionsWeight,
        isUpdate,
      );

      expect(mockHttp.put).toHaveBeenCalledWith(
        `${toolGroupsUrl}/${toolGroupId}/tools/${id}`,
        {
          data: {
            type: 'tool-group-tool',
            attributes: {
              'suggestions-weight': suggestionsWeight,
            },
            relationships: {
              tool: {
                data: {
                  type: 'resource',
                  id: toolId,
                },
              },
            },
          },
        },
        headers,
      );
    });

    it('should delete a Tool', () => {
      service.deleteTool(toolGroupId, toolId);
      expect(mockHttp.delete).toHaveBeenCalledWith(
        `${toolGroupsUrl}/${toolGroupId}/tools/${id}`,
        headers,
      );
    });
  });

  describe('Suggested Tools', () => {
    beforeEach(() => {
      spyOn(mockHttp, 'get').and.returnValue(
        Observable.create((observer) => {
          observer.next({
            json() {
              return [toolGroup, toolGroup];
            },
          });
          observer.complete();
        }),
      );
    });

    it('should fetch all toolGroups', () => {
      const languageRule = new ToolGroupRule();
      languageRule.languages = ['UK', 'US'];
      const countryRule = new ToolGroupRule();
      countryRule.countries = ['en'];
      const praxisRule = new ToolGroupRule();
      praxisRule.openness = ['1'];
      praxisRule.confidence = ['2'];

      service.getToolGroupSuggestions(countryRule, languageRule, praxisRule);

      expect(mockHttp.get).toHaveBeenCalledWith(
        `${environment.base_url}resources/suggestions?filter[country]=en&filter[language][]=UK&filter[language][]=US&filter[confidence]=2&filter[openness]=1`,
        headers,
      );
    });
  });
});
