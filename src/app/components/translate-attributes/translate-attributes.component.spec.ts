import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AceEditorDirective } from 'ng2-ace-editor';
import { NgArrayPipesModule } from 'ngx-pipes';
import { AttributeTranslation } from '../../models/attribute-translation';
import { Resource } from '../../models/resource';
import { AttributeTranslationService } from '../../service/attribute-translation.service';
import { TranslateAttributesComponent } from './translate-attributes.component';

describe('TranslateAttributesComponent', () => {
  let comp: TranslateAttributesComponent;
  let fixture: ComponentFixture<TranslateAttributesComponent>;

  const resource = new Resource();
  const attributeTranslationStub = ({
    getAttributes() {},
    create() {},
    update() {},
    delete() {},
  } as unknown) as AttributeTranslationService;

  beforeEach(() => {
    spyOn(attributeTranslationStub, 'getAttributes').and.returnValue(
      Promise.resolve<Resource>({ 'translated-attributes': [] } as Resource),
    );
    spyOn(attributeTranslationStub, 'create').and.returnValue(
      Promise.resolve<AttributeTranslation>(null),
    );
    spyOn(attributeTranslationStub, 'update').and.returnValue(
      Promise.resolve<AttributeTranslation>(null),
    );
    spyOn(attributeTranslationStub, 'delete').and.returnValue(
      Promise.resolve<void>(null),
    );

    TestBed.configureTestingModule({
      declarations: [TranslateAttributesComponent, AceEditorDirective],
      imports: [
        NgbModule,
        FormsModule,
        NgArrayPipesModule,
        HttpClientTestingModule,
      ],
      providers: [
        {
          provide: AttributeTranslationService,
          useValue: attributeTranslationStub,
        },
        { provide: NgbActiveModal },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TranslateAttributesComponent);
    comp = fixture.componentInstance;
    comp.resource = resource;
    comp.resource.name = 'Renderer Tests';
    comp.resource.id = 3;
    comp.resource['translated-attributes'] = [
      {
        id: '123',
        key: 'test_key',
        'crowdin-phrase-id': 'test_crowdin_phrase_id',
        required: false,
      },
    ];
  });

  it('Ensuring Attributes have been loaded on ngInit', () => {
    comp.ngOnInit();
    expect(attributeTranslationStub.getAttributes).toHaveBeenCalled();
  });

  it('Does clicking create attribute add an attribute to translated-attributes', () => {
    comp.resource['translated-attributes'] = [];
    fixture.debugElement
      .query(By.css('.btn.add-new-translation-attribute'))
      .nativeElement.click();

    expect(comp.resource['translated-attributes'].length).toEqual(1);
  });

  it('Create Remote Attribute', () => {
    comp.resource['translated-attributes'][0].key = 'test_key_for_testing';
    comp.resource['translated-attributes'][0]['crowdin-phrase-id'] =
      'test_crowdin_phrase_id';

    comp.mulitipleActionCreate({
      type: 'create',
      id: comp.resource['translated-attributes'][0].key,
      data: comp.resource['translated-attributes'][0],
    });

    expect(attributeTranslationStub.create).toHaveBeenCalledWith(
      3,
      comp.resource['translated-attributes'][0],
    );
  });

  it('Update Remote Attribute', () => {
    comp.mulitipleActionUpdate({
      type: 'update',
      id: comp.resource['translated-attributes'][0].key,
      data: comp.resource['translated-attributes'][0],
    });
    expect(attributeTranslationStub.update).toHaveBeenCalledWith(
      comp.resource['translated-attributes'][0],
    );
  });

  it('Delete Remote Attribute', () => {
    comp.mulitipleActionDelete({
      type: 'delete',
      id: comp.resource['translated-attributes'][0].key,
      data: comp.resource['translated-attributes'][0],
    });
    expect(attributeTranslationStub.delete).toHaveBeenCalledWith(
      comp.resource['translated-attributes'][0],
    );
  });

  it('Does removeAttribute function delete local attribute', () => {
    comp.removeAttribute(comp.resource['translated-attributes'][0]);
    expect(comp.resource['translated-attributes'].length).toEqual(0);
  });

  it('Ensure mulitipleActionSortPromises sorts promises in correct order', () => {
    comp.resource['translated-attributes'] = [
      {
        id: '111111',
        key: 'test_key_for_testing_one',
        'crowdin-phrase-id': 'test_crowdin_phrase_id_one',
        required: false,
      },
      {
        id: '222222',
        key: 'test_key_for_testing_two',
        'crowdin-phrase-id': 'test_crowdin_phrase_id_two',
        required: false,
      },
      {
        id: '333333',
        key: 'test_key_for_testing_three',
        'crowdin-phrase-id': 'test_crowdin_phrase_id_three',
        required: false,
      },
      {
        id: '444444',
        key: 'test_key_for_testing_four',
        'crowdin-phrase-id': 'test_crowdin_phrase_id_four',
        required: false,
      },
      {
        id: '555555',
        key: 'test_key_for_testing_five',
        'crowdin-phrase-id': 'test_crowdin_phrase_id_five',
        required: false,
      },
    ];
    comp.multipleActionsPromises = [
      {
        type: 'create',
        id: comp.resource['translated-attributes'][3].key,
        data: comp.resource['translated-attributes'][3],
      },
      {
        type: 'update',
        id: comp.resource['translated-attributes'][2].key,
        data: comp.resource['translated-attributes'][2],
      },
      {
        type: 'update',
        id: comp.resource['translated-attributes'][3].key,
        data: comp.resource['translated-attributes'][3],
      },
      {
        type: 'create',
        id: comp.resource['translated-attributes'][0].key,
        data: comp.resource['translated-attributes'][0],
      },
      {
        type: 'create',
        id: comp.resource['translated-attributes'][4].key,
        data: comp.resource['translated-attributes'][4],
      },
      {
        type: 'update',
        id: comp.resource['translated-attributes'][4].key,
        data: comp.resource['translated-attributes'][4],
      },
      {
        type: 'delete',
        id: comp.resource['translated-attributes'][0].key,
        data: comp.resource['translated-attributes'][0],
      },
      {
        type: 'update',
        id: comp.resource['translated-attributes'][0].key,
        data: comp.resource['translated-attributes'][0],
      },
      {
        type: 'update',
        id: comp.resource['translated-attributes'][1].key,
        data: comp.resource['translated-attributes'][1],
      },
    ];

    comp.mulitipleActionSortPromises();

    expect(comp.multipleActionsPromises[0].type).toEqual('delete');
    expect(comp.multipleActionsPromises[1].type).toEqual('update');
    expect(comp.multipleActionsPromises[2].type).toEqual('update');
    expect(comp.multipleActionsPromises[3].type).toEqual('update');
    expect(comp.multipleActionsPromises[4].type).toEqual('update');
    expect(comp.multipleActionsPromises[5].type).toEqual('update');
    expect(comp.multipleActionsPromises[6].type).toEqual('create');
    expect(comp.multipleActionsPromises[7].type).toEqual('create');
    expect(comp.multipleActionsPromises[8].type).toEqual('create');
  });

  describe('checkRemoteResourceForDifferences', () => {
    const remoteResource = new Resource();
    remoteResource.name = 'Renderer Tests';
    remoteResource.id = 3;

    beforeEach(() => {
      comp.multipleActionsPromises = [];
      remoteResource['translated-attributes'] = [];
    });

    it('Ensure compares correctly and create correct multipleActionsPromises', () => {
      comp.resource['translated-attributes'] = [
        {
          id: '111111',
          key: 'test_key_for_testing_one',
          'crowdin-phrase-id': 'test_crowdin_phrase_id_one',
          required: false,
        },
        {
          id: '222222',
          key: 'test_key_for_testing_two',
          'crowdin-phrase-id': 'test_crowdin_phrase_id_two',
          required: false,
        },
        {
          id: '444444',
          key: 'test_key_for_testing_four',
          'crowdin-phrase-id': 'test_crowdin_phrase_id_four',
          required: false,
        },
      ];

      remoteResource['translated-attributes'] = [
        {
          id: '111111',
          key: 'test_key_for_testing_One_OLD',
          'crowdin-phrase-id': 'test_crowdin_phrase_id_one',
          required: false,
        },
        {
          id: '222222',
          key: 'test_key_for_testing_two',
          'crowdin-phrase-id': 'test_crowdin_phrase_id_two_OLD',
          required: false,
        },
        {
          id: '333333',
          key: 'test_key_for_testing_three',
          'crowdin-phrase-id': 'test_key_for_testing_three',
          required: false,
        },
      ];

      comp.checkRemoteResourceForDifferences(remoteResource);
      comp.mulitipleActionSortPromises();

      // Ensure test_key_for_testing_three is prepped for deletion
      expect(comp.multipleActionsPromises[0].type).toEqual('delete');
      expect(comp.multipleActionsPromises[0].id).toEqual(
        'test_key_for_testing_three',
      );

      // Ensure test_key_for_testing_one is prepped for updating Key
      expect(comp.multipleActionsPromises[1].type).toEqual('update');
      expect(comp.multipleActionsPromises[1].id).toEqual(
        'test_key_for_testing_one',
      );

      // Ensure test_key_for_testing_two is prepped for updating crowdin phase ID
      expect(comp.multipleActionsPromises[2].type).toEqual('update');
      expect(comp.multipleActionsPromises[2].id).toEqual(
        'test_key_for_testing_two',
      );

      // Ensure test_key_for_testing_four is prepped for being created
      expect(comp.multipleActionsPromises[3].type).toEqual('create');
      expect(comp.multipleActionsPromises[3].id).toEqual(
        'test_key_for_testing_four',
      );
    });

    it('Ensure Errors if Key is empty', async () => {
      comp.resource['translated-attributes'] = [
        {
          id: '111111',
          key: '',
          'crowdin-phrase-id': 'test_crowdin_phrase_id_one',
          required: false,
        },
      ];

      const checkDifferences = await comp.checkRemoteResourceForDifferences(
        remoteResource,
      );
      // Ensure checkRemoteResourceForDifferences Errors
      expect(checkDifferences.successful).toEqual(false);
      expect(checkDifferences.message).toEqual(
        'Please ensure all Keys have a value.',
      );

      // crowdin key have value

      // 2 or more keys aren't the same
    });

    it('Ensure Errors if Crowdin Phase ID is empty', async () => {
      comp.resource['translated-attributes'] = [
        {
          id: '111111',
          key: 'test_key_for_testing_One',
          'crowdin-phrase-id': '',
          required: false,
        },
      ];

      const checkDifferences = await comp.checkRemoteResourceForDifferences(
        remoteResource,
      );

      // Ensure checkRemoteResourceForDifferences Errors
      expect(checkDifferences.successful).toEqual(false);
      expect(checkDifferences.message).toEqual(
        'Please ensure all Crowdin Phase IDs have a value.',
      );
    });

    it('Ensure Errors if 2 attributes have same key', async () => {
      comp.resource['translated-attributes'] = [
        {
          id: '111111',
          key: 'test_key_for_testing_One',
          'crowdin-phrase-id': 'test_crowdin_phrase_id_one',
          required: false,
        },
        {
          id: '222222',
          key: 'test_key_for_testing_One',
          'crowdin-phrase-id': 'test_crowdin_phrase_id_one',
          required: false,
        },
      ];

      const checkDifferences = await comp.checkRemoteResourceForDifferences(
        remoteResource,
      );

      // Ensure checkRemoteResourceForDifferences Errors
      expect(checkDifferences.successful).toEqual(false);
      expect(checkDifferences.message).toEqual(
        '2 or more keys are the same. Please make sure all keys are unique.',
      );
    });
  });
});
