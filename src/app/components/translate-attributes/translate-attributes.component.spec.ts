import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateAttributesComponent } from './translate-attributes.component';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AttributeTranslationService } from '../../service/attribute-translation.service';
import { FormsModule } from '@angular/forms';
import { AceEditorDirective } from 'ng2-ace-editor';
import { By } from '@angular/platform-browser';
import { Resource } from '../../models/resource';
import { AttributeTranslation } from '../../models/attribute-translation';
import { NgArrayPipesModule } from 'ngx-pipes';

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
      Promise.resolve<Resource>(null),
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
      imports: [NgbModule.forRoot(), FormsModule, NgArrayPipesModule],
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
    comp.resource['translated-attributes'][0]['onesky-phrase-id'] =
      'test_onesky_phrase_id';

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
        id: 111111,
        key: 'test_key_for_testing_one',
        'onesky-phrase-id': 'test_onesky_phrase_id_one',
        required: false,
      },
      {
        id: 222222,
        key: 'test_key_for_testing_two',
        'onesky-phrase-id': 'test_onesky_phrase_id_two',
        required: false,
      },
    ];
    comp.multipleActionsPromises = [
      {
        type: 'create',
        id: comp.resource['translated-attributes'][0].key,
        data: comp.resource['translated-attributes'][0],
      },
      {
        type: 'delete',
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
    expect(comp.multipleActionsPromises[2].type).toEqual('create');
  });
});
