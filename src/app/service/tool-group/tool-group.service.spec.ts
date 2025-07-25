import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import {
  ToolGroup,
  RuleTypeEnum,
  ToolGroupRule,
} from '../../models/tool-group';
import { AuthService } from '../auth/auth.service';
import {
  MockAuthService,
  requestHasAuthenticatedHeaders,
} from '../auth/mockAuthService';
import { ToolGroupService } from './tool-group.service';

const toolGroupsUrl = environment.base_url + 'tool-groups';

describe('ToolGroupService', () => {
  let service: ToolGroupService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ToolGroupService,
        { provide: AuthService, useClass: MockAuthService },
      ],
    });

    service = TestBed.inject(ToolGroupService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verify that no unmatched requests are outstanding
  });

  describe('Get Single Tool Group', () => {
    it('should fetch a single toolGroup', () => {
      const id = 7;
      const expectedUrl = `${toolGroupsUrl}/${id}?include=rules-language,rules-praxis,rules-country,tools.tool`;

      service.getToolGroup(id);

      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      requestHasAuthenticatedHeaders(req);
    });

    it('should return tool group with only languages', () => {
      const id = 8;
      const includes = 'rules-language,rules-country';
      const expectedUrl = `${toolGroupsUrl}/${id}?include=${includes}`;

      service.getToolGroup(id, includes);

      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      requestHasAuthenticatedHeaders(req);
    });
  });

  describe('Get all Tool Groups', () => {
    it('should fetch all toolGroups', () => {
      service.getToolGroups();

      const req = httpMock.expectOne(`${toolGroupsUrl}`);
      expect(req.request.method).toBe('GET');
      requestHasAuthenticatedHeaders(req);
    });
  });

  describe('Create/Edit/Delete Tool Groups', () => {
    it('should create a toolGroup', () => {
      const newToolGroup = new ToolGroup();
      newToolGroup.name = 'New Tool Group';
      newToolGroup.suggestedWeight = '12';

      const expectedBody = {
        data: {
          type: 'tool-group',
          attributes: {
            name: newToolGroup.name,
            suggestions_weight: newToolGroup.suggestedWeight,
          },
        },
      };

      service.createOrUpdateToolGroup(newToolGroup, false);

      const req = httpMock.expectOne(toolGroupsUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(expectedBody);
      requestHasAuthenticatedHeaders(req);
    });

    it('should edit a toolGroup', () => {
      const newToolGroup = new ToolGroup();
      newToolGroup.id = 8;
      newToolGroup.name = 'New Tool Group';
      newToolGroup.suggestedWeight = '12';

      const expectedBody = {
        data: {
          type: 'tool-group',
          attributes: {
            name: newToolGroup.name,
            suggestions_weight: newToolGroup.suggestedWeight,
          },
        },
      };

      service.createOrUpdateToolGroup(newToolGroup, true);

      const req = httpMock.expectOne(`${toolGroupsUrl}/${newToolGroup.id}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(expectedBody);
      requestHasAuthenticatedHeaders(req);
    });

    it('should delete a toolGroup', () => {
      const id = 8;
      service.deleteToolGroup(id);

      const req = httpMock.expectOne(`${toolGroupsUrl}/${id}`);
      expect(req.request.method).toBe('DELETE');
      requestHasAuthenticatedHeaders(req);
    });
  });

  describe('Create/Edit/Delete Rules', () => {
    const toolGroupId = 8;
    const ruleId = 1;

    it('should create a Country Rule', () => {
      const negativeRule = false;
      const data = ['string', 'string2'];
      const type = RuleTypeEnum.COUNTRY;

      const expectedBody = {
        data: {
          type: 'tool-group-rules-country',
          attributes: {
            countries: data,
            'negative-rule': negativeRule,
          },
        },
      };

      service.createOrUpdateRule(toolGroupId, null, negativeRule, data, type);

      const req = httpMock.expectOne(
        `${toolGroupsUrl}/${toolGroupId}/rules-country`,
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(expectedBody);
      requestHasAuthenticatedHeaders(req);
    });

    it('should create a Praxis Rule', () => {
      const negativeRule = true;
      const data = {
        confidence: ['1', '5'],
        openness: ['3', '0'],
      };
      const type = 'praxis';

      const expectedBody = {
        data: {
          type: 'tool-group-rules-praxis',
          attributes: {
            ...data,
            'negative-rule': negativeRule,
          },
        },
      };

      service.createOrUpdateRule(
        toolGroupId,
        null,
        negativeRule,
        data,
        type as RuleTypeEnum.PRAXIS,
      );

      const req = httpMock.expectOne(
        `${toolGroupsUrl}/${toolGroupId}/rules-praxis`,
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(expectedBody);
      requestHasAuthenticatedHeaders(req);
    });

    it('should edit a Language Rule', () => {
      const negativeRule = true;
      const data = ['string', 'string2'];
      const type = 'language';

      const expectedBody = {
        data: {
          type: 'tool-group-rules-language',
          attributes: {
            languages: data,
            'negative-rule': negativeRule,
          },
        },
      };

      service.createOrUpdateRule(
        toolGroupId,
        ruleId,
        negativeRule,
        data,
        type as RuleTypeEnum.LANGUAGE,
      );

      const req = httpMock.expectOne(
        `${toolGroupsUrl}/${toolGroupId}/rules-language/${ruleId}`,
      );
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(expectedBody);
      requestHasAuthenticatedHeaders(req);
    });

    it('should delete a country rule', () => {
      service.deleteRule(
        toolGroupId,
        ruleId,
        'country' as RuleTypeEnum.COUNTRY,
      );

      const req = httpMock.expectOne(
        `${toolGroupsUrl}/${toolGroupId}/rules-country/${ruleId}`,
      );
      expect(req.request.method).toBe('DELETE');
      requestHasAuthenticatedHeaders(req);
    });

    it('should delete a praxis rule', () => {
      service.deleteRule(toolGroupId, ruleId, 'praxis' as RuleTypeEnum.PRAXIS);

      const req = httpMock.expectOne(
        `${toolGroupsUrl}/${toolGroupId}/rules-praxis/${ruleId}`,
      );
      expect(req.request.method).toBe('DELETE');
      requestHasAuthenticatedHeaders(req);
    });

    it('should delete a language rule', () => {
      service.deleteRule(
        toolGroupId,
        ruleId,
        'language' as RuleTypeEnum.LANGUAGE,
      );

      const req = httpMock.expectOne(
        `${toolGroupsUrl}/${toolGroupId}/rules-language/${ruleId}`,
      );
      expect(req.request.method).toBe('DELETE');
      requestHasAuthenticatedHeaders(req);
    });
  });

  describe('Create/Edit/Delete Tools', () => {
    const toolGroupId = 8;
    const id = '1';
    const toolId = '1';

    it('should create a Tool', () => {
      const suggestionsWeight = '2.0';
      const isUpdate = false;

      const expectedBody = {
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
      };

      service.addOrUpdateTool(
        toolGroupId,
        null,
        toolId,
        suggestionsWeight,
        isUpdate,
      );

      const req = httpMock.expectOne(`${toolGroupsUrl}/${toolGroupId}/tools`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(expectedBody);
      requestHasAuthenticatedHeaders(req);
    });

    it('should edit a Tool', () => {
      const suggestionsWeight = '2.0';
      const isUpdate = true;

      const expectedBody = {
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
      };

      service.addOrUpdateTool(
        toolGroupId,
        id,
        toolId,
        suggestionsWeight,
        isUpdate,
      );

      const req = httpMock.expectOne(
        `${toolGroupsUrl}/${toolGroupId}/tools/${id}`,
      );
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(expectedBody);
      requestHasAuthenticatedHeaders(req);
    });

    it('should delete a Tool', () => {
      service.deleteTool(toolGroupId, toolId);

      const req = httpMock.expectOne(
        `${toolGroupsUrl}/${toolGroupId}/tools/${id}`,
      );
      expect(req.request.method).toBe('DELETE');
      requestHasAuthenticatedHeaders(req);
    });
  });

  describe('Suggested Tools', () => {
    it('should fetch all toolGroups', () => {
      const languageRule = new ToolGroupRule();
      languageRule.languages = ['UK', 'US'];
      const countryRule = new ToolGroupRule();
      countryRule.countries = ['en'];
      const praxisRule = new ToolGroupRule();
      praxisRule.openness = ['1'];
      praxisRule.confidence = ['2'];

      const expectedUrl = `${environment.base_url}resources/suggestions?filter[country]=en&filter[language][]=UK&filter[language][]=US&filter[confidence]=2&filter[openness]=1`;

      service.getToolGroupSuggestions(countryRule, languageRule, praxisRule);

      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      requestHasAuthenticatedHeaders(req);
    });
  });
});
