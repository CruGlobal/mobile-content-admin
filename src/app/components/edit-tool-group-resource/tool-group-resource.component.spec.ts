import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NgArrayPipesModule } from 'ngx-pipes';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash'
import { ToolGroupService } from '../../service/tool-group/tool-group.service';
import { ResourceService } from '../../service/resource/resource.service';
import { ToolGroupRule, Tools } from '../../models/tool-group';
import { Resource } from '../../models/resource';
import { toolGroupFullDetails } from '../../_tests/toolGroupMocks'
import { ToolGroupResourceComponent } from './tool-group-resource.component';
import { ToolGroupToolReuseableComponent } from '../edit-tool-group-tool-reuseable/tool-group-tool-reuseable.component';

fdescribe('ToolGroupResourceComponent', () => {
  let comp: ToolGroupResourceComponent;
  let fixture: ComponentFixture<ToolGroupResourceComponent>;

  const toolGroupServiceStub = ({
    deleteRule() {},
    addOrUpdateTool() {},
  } as unknown) as ToolGroupService;
  const resourceServiceStub = ({
    getResources() {},
  } as unknown) as ResourceService;
  const activeModalStub = ({
    close() {},
  } as unknown) as NgbActiveModal;
  const toolGroupRule = new ToolGroupRule()
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
    }
  ]

  beforeEach(() => {
    spyOn(toolGroupServiceStub, 'deleteRule').and.returnValue(
      Promise.resolve({
        status: 'success',
      }),
    );
    spyOn(toolGroupServiceStub, 'addOrUpdateTool').and.returnValue(
      Promise.resolve({}),
    );
    spyOn(resourceServiceStub, 'getResources').and.returnValue(
      Promise.resolve<Resource[]>(resources),
    );

    spyOn(activeModalStub, 'close');

    TestBed.configureTestingModule({
      declarations: [
        ToolGroupResourceComponent,
        ToolGroupToolReuseableComponent,
      ],
      imports: [NgbModule.forRoot(), FormsModule, NgArrayPipesModule],
      providers: [
        { provide: ToolGroupService, useValue: toolGroupServiceStub },
        { provide: ResourceService, useValue: resourceServiceStub },
        { provide: NgbActiveModal, useValue: activeModalStub  },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ToolGroupResourceComponent);
    comp = fixture.componentInstance;



    comp.toolGroup = toolGroupFullDetails
    comp.resources = resources;
  });

  describe('ngOnInit', () => {

    it('should assign tools', () => {
      comp.ngOnInit();
      expect(comp.initialTools).toEqual(toolGroupFullDetails.tools)
      expect(comp.tools).toEqual(toolGroupFullDetails.tools)
    });

    it('should create new Tool', () => {
      comp.toolGroup.tools = []
      comp.ngOnInit();
      expect(comp.initialTools).toEqual([])
      expect(comp.tools[0].tool).toEqual(undefined)
    });


    it('should re-fetch resources', () => {
      comp.resources = []
      comp.ngOnInit();
      expect(resourceServiceStub.getResources).toHaveBeenCalled();
    });
  });

  describe('updateTool() & deleteTool()', () => {
    const tool = toolGroupFullDetails.tools[0] as unknown as Tools;
    beforeEach(() => {
      comp.ngOnInit();
      comp.tools = [
        {
          ...tool
        },
        {
          ...tool,
          id: '5',
        }
      ]
    })

    it('should update suggestionsWeight - updateTool()', (done) => {
      tool.suggestionsWeight = '50';
      comp.updateTool(tool);
      setTimeout(() => {
        console.log('comp.tools', comp.tools)
        expect(comp.tools[0].suggestionsWeight).toEqual('50')
        done()
      })
    });

    it('should delete tool - deleteTool()', () => {
      expect(comp.tools.length).toEqual(2)
      comp.deleteTool('5');
      expect(comp.tools.length).toEqual(1)
    });

  });



  describe('createOrUpdate()', () => {
    const tool = toolGroupFullDetails.tools[0] as unknown as Tools;
    beforeEach(() => {
      comp.ngOnInit();
    })

    it('should create one tool and update another', (done) => {
      comp.tools = [
        {
          ...tool
        },
        {
          ...tool,
          id: '5',
        }
      ]
      comp.createOrUpdate();
      setTimeout(() => {
        expect(toolGroupServiceStub.addOrUpdateTool).toHaveBeenCalledTimes(2)
        // Second request
        expect(toolGroupServiceStub.addOrUpdateTool).toHaveBeenCalledWith(
          comp.toolGroup.id,
          comp.tools[1].id,
          comp.tools[1].tool.id.toString(),
          comp.tools[1].suggestionsWeight,
          false,
        )
        expect(activeModalStub.close).toHaveBeenCalled();
        done()
      })
    });

    it('should just update one tool', (done) => {
      comp.initialTools = [tool]
      comp.tools = [tool]
      comp.createOrUpdate();
      setTimeout(() => {
        expect(toolGroupServiceStub.addOrUpdateTool).toHaveBeenCalledTimes(1)
        expect(toolGroupServiceStub.addOrUpdateTool).toHaveBeenCalledWith(
          comp.toolGroup.id,
          comp.tools[0].id,
          comp.tools[0].tool.id.toString(),
          comp.tools[0].suggestionsWeight,
          true,
        )
        expect(activeModalStub.close).toHaveBeenCalled();
        done()
      })
    });
  });
});
