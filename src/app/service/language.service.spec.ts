import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { Language } from '../models/language';
import { AuthService } from './auth/auth.service';
import {
  MockAuthService,
  requestHasAuthenticatedHeaders,
} from './auth/mockAuthService';
import { LanguageService } from './language.service';

const languagesUrl = environment.base_url + 'languages';

describe('LanguageService', () => {
  let service: LanguageService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        LanguageService,
        { provide: AuthService, useClass: MockAuthService },
      ],
    });

    service = TestBed.inject(LanguageService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verify that no unmatched requests are outstanding
  });

  describe('updateLanguage()', () => {
    it('updating uses authorization and sends dashed attributes', () => {
      const language = new Language();
      language.id = 12;
      language.name = 'French';
      language.code = 'fr';
      language['crowdin-code'] = 'fr-CA';
      language['force-language-name'] = true;

      const expectedBody = {
        data: {
          id: language.id,
          type: 'language',
          attributes: {
            name: language.name,
            'crowdin-code': 'fr-CA',
            'force-language-name': true,
          },
        },
      };

      service.updateLanguage(language);

      const req = httpMock.expectOne(`${languagesUrl}/${language.id}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(expectedBody);
      expect(req.request.body.data.attributes['code']).toBeUndefined();
      requestHasAuthenticatedHeaders(req);
    });

    it('coerces empty crowdin-code to null and undefined force-language-name to false', () => {
      const language = new Language();
      language.id = 12;
      language.name = 'French';
      language.code = 'fr';
      language['crowdin-code'] = '';

      const expectedBody = {
        data: {
          id: language.id,
          type: 'language',
          attributes: {
            name: language.name,
            'crowdin-code': null,
            'force-language-name': false,
          },
        },
      };

      service.updateLanguage(language);

      const req = httpMock.expectOne(`${languagesUrl}/${language.id}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(expectedBody);
      requestHasAuthenticatedHeaders(req);
    });
  });

  describe('createLanguage()', () => {
    it('creating uses authorization and includes code with the new attributes', () => {
      const language = new Language();
      language.name = 'German';
      language.code = 'de';
      language['crowdin-code'] = 'de-DE';
      language['force-language-name'] = true;

      const expectedBody = {
        data: {
          type: 'language',
          attributes: {
            name: language.name,
            code: language.code,
            'crowdin-code': 'de-DE',
            'force-language-name': true,
          },
        },
      };

      service.createLanguage(language);

      const req = httpMock.expectOne(languagesUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(expectedBody);
      requestHasAuthenticatedHeaders(req);
    });

    it('defaults crowdin-code to null and force-language-name to false when unset', () => {
      const language = new Language();
      language.name = 'German';
      language.code = 'de';

      const expectedBody = {
        data: {
          type: 'language',
          attributes: {
            name: language.name,
            code: language.code,
            'crowdin-code': null,
            'force-language-name': false,
          },
        },
      };

      service.createLanguage(language);

      const req = httpMock.expectOne(languagesUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(expectedBody);
      requestHasAuthenticatedHeaders(req);
    });
  });
});
