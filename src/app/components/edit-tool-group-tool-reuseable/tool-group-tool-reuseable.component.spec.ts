import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgArrayPipesModule } from 'ngx-pipes';
import { ToolGroupMocks } from '../../_tests/toolGroupMocks';
import { Resource } from '../../models/resource';
import { ToolGroupToolReuseableComponent } from './tool-group-tool-reuseable.component';

describe('ToolGroupToolReuseableComponent', () => {
  let comp: ToolGroupToolReuseableComponent;
  let fixture: ComponentFixture<ToolGroupToolReuseableComponent>;

  const resources = [
    {
      ...new Resource(),
      id: 1,
      name: 'First Resource',
    },
    {
      ...new Resource(),
      id: 13,
      name: 'Test Resource',
    },
  ];
  const mocks = new ToolGroupMocks();
  const toolGroupFullDetails = mocks.toolGroupFullDetails();

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ToolGroupToolReuseableComponent],
      imports: [
        NgbModule,
        FormsModule,
        NgArrayPipesModule,
        HttpClientTestingModule,
      ],
      providers: [{ provide: NgbActiveModal }],
    }).compileComponents();

    fixture = TestBed.createComponent(ToolGroupToolReuseableComponent);
    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should assign the correct data', () => {
      comp.tool = toolGroupFullDetails.tools[0];
      comp.resources = resources;

      comp.updatedToolEmit.subscribe((value) => ({
        ...value,
        tool: {
          ...value.tool,
          name: 'New Name',
        },
      }));
      comp.ngOnInit();
      expect(comp.suggestionsWeight).toEqual('12');
    });
  });
});
