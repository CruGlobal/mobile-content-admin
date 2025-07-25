import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LanguageService } from '../../service/language.service';
import { FormsModule } from '@angular/forms';
import { ResourcesComponent } from './resources.component';
import { ResourceService } from '../../service/resource/resource.service';
import { TranslationComponent } from '../translation/translation.component';
import { Resource } from '../../models/resource';
import { DraftService } from '../../service/draft.service';
import { ResourceComponent } from '../resource/resource.component';
import { Language } from '../../models/language';
import { TranslationVersionBadgeComponent } from '../translation/translation-version-badge/translation-version-badge.component';
import { ResourceTypeService } from '../../service/resource-type.service';
import { SystemService } from '../../service/system.service';

describe('ResourcesComponent', () => {
  let comp: ResourcesComponent;
  let fixture: ComponentFixture<ResourcesComponent>;

  const resourceServiceStub = ({
    getResources() {},
  } as unknown) as ResourceService;
  const languageServiceStub = ({
    getLanguage() {},
  } as unknown) as LanguageService;
  const languageStub = ({
    _placeHolder: true,
  } as unknown) as Language;

  const resource: Resource = new Resource();
  const unfilteredResources = [
    {
      name: 'GodTools CYOA Tool - Hidden',
      abbreviation: 'emojitool2',
      description: 'Emoji survey for the holiday season',
      id: 123,
      system: { id: 1, name: 'GodTools' },
      manifest: '',
      showTranslations: false,
      oneskyProjectId: 78097,
      resourceType: { id: 2, name: 'cyoa' },
      variants: [],
      'latest-drafts-translations': [],
      attachments: [],
      pages: [],
      tips: [],
      latest: [],
      data: { id: 22 },
      customManifests: [],
      'attr-default-order': 2,
      'attr-hidden': true,
      'resource-type': 'cyoa',
    },
    {
      name: 'GodTools Tract Tool - Not Hidden',
      abbreviation: 'emojitool2',
      description: 'Tract for all purposes',
      id: 123,
      system: { id: 1, name: 'GodTools' },
      manifest: '',
      showTranslations: false,
      oneskyProjectId: 385532,
      resourceType: { id: 1, name: 'tract' },
      variants: [],
      'latest-drafts-translations': [],
      attachments: [],
      pages: [],
      tips: [],
      latest: [],
      data: { id: 13 },
      customManifests: [],
      'attr-default-order': 1,
      'resource-type': 'tract',
    },
    {
      name: 'Test System Lesson Tool - Not Hidden',
      abbreviation: 'lesson2',
      description: 'Lesson for the holiday season',
      id: 123,
      system: { id: 99, name: 'Test' },
      manifest: '',
      showTranslations: false,
      oneskyProjectId: 456858656,
      resourceType: { id: 3, name: 'lesson' },
      variants: [],
      'latest-drafts-translations': [],
      attachments: [],
      pages: [],
      tips: [],
      latest: [],
      data: { id: 77 },
      customManifests: [],
      'resource-type': 'lesson',
    },
  ];

  beforeEach(
    waitForAsync(() => {
      spyOn(resourceServiceStub, 'getResources').and.returnValue(
        Promise.resolve([resource]),
      );
      spyOn(languageServiceStub, 'getLanguage').and.returnValue(
        Promise.resolve(languageStub),
      );

      TestBed.configureTestingModule({
        declarations: [
          ResourcesComponent,
          ResourceComponent,
          TranslationComponent,
          TranslationVersionBadgeComponent,
        ],
        imports: [NgbModule, FormsModule, HttpClientTestingModule],
        providers: [
          { provide: ResourceService, useValue: resourceServiceStub },
          { provide: LanguageService, useValue: languageServiceStub },
          { provide: NgbModal },
          { provide: DraftService },
          { provide: ResourceTypeService },
          { provide: SystemService },
        ],
      }).compileComponents();
    }),
  );

  let localStore;

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourcesComponent);
    comp = fixture.componentInstance;

    localStore = {};

    spyOn(window.localStorage, 'getItem').and.callFake((key) =>
      key in localStore ? localStore[key] : null,
    );
    spyOn(window.localStorage, 'setItem').and.callFake(
      (key, value) => (localStore[key] = value + ''),
    );
    spyOn(window.localStorage, 'clear').and.callFake(() => (localStore = {}));
  });

  afterEach(() => {
    comp.clearFilters();
  });

  it('should include pages when loading resources', (done) => {
    comp.loadResources();

    setTimeout(() => {
      expect(resourceServiceStub.getResources).toHaveBeenCalledWith(
        'latest-drafts-translations,pages,custom-manifests,tips,attachments,variants',
      );
      done();
    });
  });

  it('should filter resources by hidden', (done) => {
    comp.unfilteredResources = unfilteredResources;
    comp.filterAndSort();
    setTimeout(() => {
      comp.toggleResources('other', 'hidden');
    });

    setTimeout(() => {
      expect(
        comp.resources.find(
          (r) => r.name === 'GodTools Tract Tool - Not Hidden',
        ),
      ).toEqual(undefined);
      expect(
        comp.resources.find((r) => r.name === 'GodTools CYOA Tool - Hidden'),
      ).toBeTruthy();
      done();
    });
  });

  it('should filter resources by type', (done) => {
    comp.unfilteredResources = unfilteredResources;
    comp.filterAndSort();
    comp.toggleResources('type', 'tract');

    setTimeout(() => {
      expect(
        comp.resources.find(
          (r) => r.name === 'GodTools Tract Tool - Not Hidden',
        ),
      ).toBeTruthy();
      expect(
        comp.resources.find((r) => r.name === 'GodTools CYOA Tool - Hidden'),
      ).toEqual(undefined);
      done();
    });
  });

  it('should filter resources by system', (done) => {
    comp.unfilteredResources = unfilteredResources;
    comp.filterAndSort();
    comp.toggleResources('system', 99);

    setTimeout(() => {
      expect(
        comp.resources.find(
          (r) => r.name === 'Test System Lesson Tool - Not Hidden',
        ),
      ).toBeTruthy();
      expect(
        comp.resources.find((r) => r.name === 'GodTools CYOA Tool - Hidden'),
      ).toEqual(undefined);
      done();
    });
  });
  it('should set local storage', (done) => {
    comp.unfilteredResources = unfilteredResources;
    comp.filterAndSort();
    comp.toggleResources('system', 99);
    const expectedData = {
      type: [],
      system: [99],
      other: [],
    };

    setTimeout(() => {
      expect(localStorage.getItem('filters')).toEqual(
        JSON.stringify(expectedData),
      );
      done();
    });
  });
  it('should sort by content order', (done) => {
    comp.unfilteredResources = unfilteredResources;
    comp.updateSort('content');

    setTimeout(() => {
      expect(comp.resources[0].name).toEqual(
        'GodTools Tract Tool - Not Hidden',
      );
      done();
    });
  });
});
