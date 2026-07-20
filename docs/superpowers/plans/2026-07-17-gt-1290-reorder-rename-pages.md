# GT-1290: Reorder and Rename Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let content authors reorder and rename a tool's pages from the admin UI, backed by new mobile-content-api support.

**Architecture:** Two repos, two PRs. Part A adds API support: `PagesController#update` also permits `filename`, and a new `POST /resources/:resource_id/pages/reorder` endpoint atomically renumbers all pages of a resource. Part B adds the admin UI: CDK drag-and-drop on the "Default Pages" list and an inline filename editor, both calling `PageService`.

**Tech Stack:** Rails 8 / RSpec (rspec_api_documentation acceptance specs) / standardrb — Angular 13, `@angular/cdk@13`, ng-bootstrap, Karma + Jasmine.

**Spec:** `docs/superpowers/specs/2026-07-17-gt-1290-reorder-rename-pages-design.md` (in the mobile-content-admin repo). One deviation from the spec: validation and bad-input errors return **400**, not 422, matching this API's `rescue_from ActiveRecord::RecordInvalid → :bad_request` and `Error::BadRequestError` conventions.

**Working directories:**

- Part A: `/Users/william.james/Desktop/repos/mobile-content-api` (fresh clone, on `master`)
- Part B: `/Users/william.james/Desktop/repos/mobile-content-admin/.worktrees/GT-1290` (worktree, branch `GT-1290`)

**Part A environment notes:**

- Ruby 3.3.10 is installed via rvm but is NOT the shell default. Prefix every ruby command with `~/.rvm/bin/rvm 3.3.10 do`, e.g. `~/.rvm/bin/rvm 3.3.10 do bundle exec rspec`.
- `bundle install` and `rails db:create db:schema:load` have already been run successfully; Postgres is running locally.
- Test data comes from `db/seeds.rb` (loaded by `spec/rails_helper.rb`): resource 1 ("kgp") has two pages — `04_ThirdPoint.xml` at position 0 and `13_FinalPage.xml` at position 1.
- `pages` has a DB **unique index on (position, resource_id)**, so reorder must renumber in two passes inside a transaction (park at negative positions, then assign 0..n-1).

---

## Part A — mobile-content-api

### Task A1: Branch + baseline

**Files:** none modified.

- [ ] **Step 1: Create the branch**

```bash
cd /Users/william.james/Desktop/repos/mobile-content-api
git checkout -b GT-1290
```

- [ ] **Step 2: Verify baseline tests pass**

Run: `~/.rvm/bin/rvm 3.3.10 do bundle exec rspec spec/acceptance/pages_controller_spec.rb spec/models/page_spec.rb`
Expected: `10 examples, 0 failures`

### Task A2: Permit `filename` in page update

**Files:**
- Modify: `app/controllers/pages_controller.rb`
- Test: `spec/acceptance/pages_controller_spec.rb`

- [ ] **Step 1: Write the failing tests**

In `spec/acceptance/pages_controller_spec.rb`, add a new `put` block immediately after the existing `put "pages/:id" do ... end` block (before the final `end` of the file). Note the existing put block stubs `Page.find`; this new block deliberately uses real records instead:

```ruby
  put "pages/:id" do
    let(:id) { 1 }

    requires_authorization

    it "updates the filename" do
      do_request data: {type: :page, attributes: {filename: "renamed.xml"}}

      expect(status).to eq(200)
      expect(Page.find(1).filename).to eq("renamed.xml")
    end

    it "rejects a filename already used by another page of the resource" do
      other = Page.find(1).resource.pages.where.not(id: 1).first

      do_request data: {type: :page, attributes: {filename: other.filename}}

      expect(status).to eq(400)
      expect(Page.find(1).filename).not_to eq(other.filename)
    end
  end
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `~/.rvm/bin/rvm 3.3.10 do bundle exec rspec spec/acceptance/pages_controller_spec.rb`
Expected: 2 failures — "updates the filename" fails because `filename` is filtered out by `permit(:structure)` (filename stays unchanged); the duplicate test may pass trivially or fail — either is fine at this stage.

- [ ] **Step 3: Permit filename in the controller**

In `app/controllers/pages_controller.rb`, change the `update` action's permit list:

```ruby
  def update
    page = Page.find(params[:id])
    page.update!(params.require(:data).require(:attributes).permit(:structure, :filename))
    render json: page, status: :ok
  end
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `~/.rvm/bin/rvm 3.3.10 do bundle exec rspec spec/acceptance/pages_controller_spec.rb`
Expected: 0 failures.

- [ ] **Step 5: Commit**

```bash
cd /Users/william.james/Desktop/repos/mobile-content-api
git add app/controllers/pages_controller.rb spec/acceptance/pages_controller_spec.rb
git commit -m "Allow updating page filename via pages#update"
```

### Task A3: Reorder endpoint

**Files:**
- Modify: `config/routes.rb`
- Modify: `app/controllers/pages_controller.rb`
- Test: `spec/acceptance/pages_controller_spec.rb`

- [ ] **Step 1: Write the failing tests**

In `spec/acceptance/pages_controller_spec.rb`, add a new block after the `put` block added in Task A2 (still inside `resource "Pages"`):

```ruby
  post "resources/:resource_id/pages/reorder" do
    let(:resource_id) { 1 }
    let(:ordered_ids) { Resource.find(1).pages.order(:position).pluck(:id) }

    requires_authorization

    it "reorders the resource's pages" do
      reversed_ids = ordered_ids.reverse

      do_request data: {type: :page, attributes: {page_ids: reversed_ids}}

      expect(status).to eq(200)
      expect(Resource.find(1).pages.order(:position).pluck(:id)).to eq(reversed_ids)
      expect(Resource.find(1).pages.order(:position).pluck(:position)).to eq([0, 1])
    end

    it "rejects page ids that don't match the resource's pages" do
      do_request data: {type: :page, attributes: {page_ids: [ordered_ids.first]}}

      expect(status).to eq(400)
    end
  end
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `~/.rvm/bin/rvm 3.3.10 do bundle exec rspec spec/acceptance/pages_controller_spec.rb`
Expected: the new examples fail with a routing error (no route matches `resources/1/pages/reorder`).

- [ ] **Step 3: Add the route**

In `config/routes.rb`, inside the existing `resources :resources do ... end` block (the one containing `post "translations/publish"`), add:

```ruby
    post "pages/reorder", to: "pages#reorder"
```

- [ ] **Step 4: Add the controller action**

In `app/controllers/pages_controller.rb`, add below `update`:

```ruby
  def reorder
    resource = Resource.find(params[:resource_id])
    ordered_ids = params.require(:data).require(:attributes).require(:page_ids).map(&:to_i)
    unless ordered_ids.sort == resource.pages.pluck(:id).sort
      raise Error::BadRequestError, "page_ids must contain exactly the ids of the resource's pages"
    end

    Page.transaction do
      # park all positions at unique negative values to avoid colliding with the
      # (position, resource_id) unique index, then assign the final 0..n-1 order
      resource.pages.update_all("position = -position - 1")
      ordered_ids.each_with_index do |page_id, index|
        Page.where(id: page_id).update_all(position: index)
      end
      resource.touch
    end

    render json: resource.pages.order(:position), status: :ok
  end
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `~/.rvm/bin/rvm 3.3.10 do bundle exec rspec spec/acceptance/pages_controller_spec.rb spec/models/page_spec.rb`
Expected: 0 failures.

- [ ] **Step 6: Lint**

Run: `~/.rvm/bin/rvm 3.3.10 do bundle exec standardrb --fix app/controllers/pages_controller.rb config/routes.rb spec/acceptance/pages_controller_spec.rb`
Expected: no offenses (after autofix).

- [ ] **Step 7: Commit**

```bash
cd /Users/william.james/Desktop/repos/mobile-content-api
git add config/routes.rb app/controllers/pages_controller.rb spec/acceptance/pages_controller_spec.rb
git commit -m "Add pages reorder endpoint for resources"
```

### Task A4: Full API test suite

- [ ] **Step 1: Run the whole suite**

Run: `~/.rvm/bin/rvm 3.3.10 do bundle exec rspec`
Expected: 0 failures (suite was green at baseline). If unrelated pre-existing failures appear, note them and confirm they also fail on `master` before proceeding.

- [ ] **Step 2: Run full lint**

Run: `~/.rvm/bin/rvm 3.3.10 do bundle exec standardrb --format simple`
Expected: no offenses.

---

## Part B — mobile-content-admin

All commands run from `/Users/william.james/Desktop/repos/mobile-content-admin/.worktrees/GT-1290`.
Tests: `yarn test --watch=false --browsers=ChromeHeadless`. Baseline is 141 tests green; ignore the pre-existing "Some of your tests did a full page reload!" message printed after the summary — it exists on master.

### Task B1: Add @angular/cdk

**Files:**
- Modify: `package.json`, `yarn.lock`
- Modify: `src/app/app.module.ts`

- [ ] **Step 1: Install the CDK matching Angular 13**

```bash
yarn add @angular/cdk@^13.0.0
```

Expected: resolves to 13.x (e.g. 13.3.9) with no peer-dependency errors for @angular/core 13.4.0.

- [ ] **Step 2: Import DragDropModule**

In `src/app/app.module.ts`:

Add to the imports at the top (import order is lint-enforced — `@angular/cdk` sorts before `@angular/common`):

```ts
import { DragDropModule } from '@angular/cdk/drag-drop';
```

Add `DragDropModule,` to the `imports: [...]` array of the `@NgModule` (alphabetical spot: after `BrowserModule`, before `FileUploadModule` — match the existing ordering style).

- [ ] **Step 3: Verify build and tests still pass**

Run: `yarn test --watch=false --browsers=ChromeHeadless`
Expected: `141 SUCCESS`.

- [ ] **Step 4: Commit**

```bash
git add package.json yarn.lock src/app/app.module.ts
git commit -m "GT-1290 Add @angular/cdk for drag-drop"
```

### Task B2: PageService — rename + reorder support

**Files:**
- Create: `src/app/service/page.service.spec.ts`
- Modify: `src/app/service/page.service.ts`
- Modify: `src/app/components/page/page.component.ts` (caller of `update`)

- [ ] **Step 1: Write the failing service tests**

Create `src/app/service/page.service.spec.ts`:

```ts
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { AuthService } from './auth/auth.service';
import { MockAuthService } from './auth/mockAuthService';
import { PageService } from './page.service';

describe('PageService', () => {
  let service: PageService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PageService,
        { provide: AuthService, useClass: MockAuthService },
      ],
    });

    service = TestBed.inject(PageService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('update sends structure and filename attributes', () => {
    service.update(7, { structure: '<page/>', filename: 'renamed.xml' });

    const req = httpMock.expectOne(`${environment.base_url}pages/7`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body.data.attributes).toEqual({
      structure: '<page/>',
      filename: 'renamed.xml',
    });
  });

  it('update sends only the provided attributes', () => {
    service.update(7, { structure: '<page/>' });

    const req = httpMock.expectOne(`${environment.base_url}pages/7`);
    expect(req.request.body.data.attributes).toEqual({
      structure: '<page/>',
    });
  });

  it('reorder posts the ordered page ids to the resource reorder endpoint', () => {
    service.reorder(13, [3, 1, 2]);

    const req = httpMock.expectOne(
      `${environment.base_url}resources/13/pages/reorder`,
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.has('Authorization')).toBe(true);
    expect(req.request.body.data.attributes).toEqual({ page_ids: [3, 1, 2] });
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `yarn test --watch=false --browsers=ChromeHeadless`
Expected: compilation errors — `update` doesn't accept an attributes object and `reorder` doesn't exist.

- [ ] **Step 3: Implement the service changes**

In `src/app/service/page.service.ts`, replace the `update` method and add `reorder`:

```ts
  update(
    pageId: number,
    attributes: { structure?: string; filename?: string },
  ): Promise<Page> {
    const url = `${this.pagesUrl}/${pageId}`;

    const payload = {
      data: {
        id: pageId,
        type: 'page',
        attributes,
      },
    };

    return this.http
      .put(url, payload, this.authService.getAuthorizationAndOptions())
      .toPromise()
      .then((response) => new JsonApiDataStore().sync(response))
      .catch(this.handleError);
  }

  reorder(resourceId: number, pageIds: number[]): Promise<void> {
    const url = `${environment.base_url}resources/${resourceId}/pages/reorder`;

    const payload = {
      data: {
        type: 'page',
        attributes: { page_ids: pageIds },
      },
    };

    return this.http
      .post(url, payload, this.authService.getAuthorizationAndOptions())
      .toPromise()
      .then(() => undefined)
      .catch(this.handleError);
  }
```

- [ ] **Step 4: Update the existing caller**

In `src/app/components/page/page.component.ts`, change the `updatePage` method's service call:

```ts
  updatePage(): void {
    this.pageService
      .update(this.page.id, { structure: this.page.structure })
      .then(() => this.activeModal.close())
      .catch(this.handleError.bind(this));
  }
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `yarn test --watch=false --browsers=ChromeHeadless`
Expected: `144 SUCCESS` (141 baseline + 3 new).

- [ ] **Step 6: Commit**

```bash
git add src/app/service/page.service.ts src/app/service/page.service.spec.ts src/app/components/page/page.component.ts
git commit -m "GT-1290 Support page rename and reorder in PageService"
```

### Task B3: Drag-and-drop reorder in the resource page list

**Files:**
- Modify: `src/app/components/resource/resource.component.ts`
- Modify: `src/app/components/resource/resource.component.html`
- Test: `src/app/components/resource/resource.component.spec.ts`

- [ ] **Step 1: Write the failing component tests**

In `src/app/components/resource/resource.component.spec.ts`:

Add imports at the top (respect import order — `@angular/cdk` before `@angular/common`):

```ts
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Page } from '../../models/page';
import { PageService } from '../../service/page.service';
```

Add a `PageService` stub next to `languageServiceStub`:

```ts
  const pageServiceStub = ({
    update() {},
    reorder() {},
  } as unknown) as PageService;
```

Register it: add `DragDropModule` to the TestBed `imports` array and `{ provide: PageService, useValue: pageServiceStub }` to `providers`.

Add a helper next to `buildTranslation`:

```ts
  const buildPage = (id: number, filename: string, position: number): Page => {
    const page = new Page();
    page.id = id;
    page.filename = filename;
    page.position = position;
    return page;
  };
```

Add a new top-level `describe` block after the `'loading languages'` describe:

```ts
  describe('page reordering', () => {
    beforeEach(() => {
      resource.id = 13;
      resource['latest-drafts-translations'] = [];
      resource['pages'] = [
        buildPage(2, 'second.xml', 1),
        buildPage(1, 'first.xml', 0),
      ];
      resource['tips'] = [];
      comp.ngOnInit();
    });

    it('sorts pages by position for display', () => {
      expect(comp.pages.map((page) => page.filename)).toEqual([
        'first.xml',
        'second.xml',
      ]);
    });

    it('drop saves the new order and updates positions', (done) => {
      (pageServiceStub.reorder as jasmine.Spy).and.returnValue(
        Promise.resolve(),
      );

      comp.onPageDrop({ previousIndex: 0, currentIndex: 1 } as CdkDragDrop<
        Page[]
      >);

      setTimeout(() => {
        expect(pageServiceStub.reorder).toHaveBeenCalledWith(13, [2, 1]);
        expect(comp.pages.map((page) => page.id)).toEqual([2, 1]);
        expect(comp.pages.map((page) => page.position)).toEqual([0, 1]);
        done();
      });
    });

    it('drop reverts the order when saving fails', (done) => {
      (pageServiceStub.reorder as jasmine.Spy).and.returnValue(
        Promise.reject('the server said no'),
      );

      comp.onPageDrop({ previousIndex: 0, currentIndex: 1 } as CdkDragDrop<
        Page[]
      >);

      setTimeout(() => {
        expect(comp.pages.map((page) => page.id)).toEqual([1, 2]);
        expect(comp.pageErrorMessage).toBe('the server said no');
        done();
      });
    });
  });
```

Also add a `spyOn` for `reorder` and `update` in the existing `beforeEach(waitForAsync(...))` (default return values; individual tests override with `.and.returnValue`):

```ts
      spyOn(pageServiceStub, 'reorder').and.returnValue(Promise.resolve());
      spyOn(pageServiceStub, 'update').and.returnValue(Promise.resolve(null));
```

Note: the `'loading languages'` describe's `beforeEach` must also keep working — it already sets `resource['pages'] = []`.

- [ ] **Step 2: Run tests to verify they fail**

Run: `yarn test --watch=false --browsers=ChromeHeadless`
Expected: compilation errors — `comp.pages`, `comp.onPageDrop`, `comp.pageErrorMessage` don't exist.

- [ ] **Step 3: Implement the component logic**

In `src/app/components/resource/resource.component.ts`:

Add imports (`@angular/cdk/drag-drop` sorts before `@angular/core`):

```ts
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { PageService } from '../../service/page.service';
```

Add fields below `errorMessage: string;`:

```ts
  pages: Page[] = [];
  pageErrorMessage: string = null;
```

Add `private pageService: PageService,` to the constructor parameters.

In `ngOnInit`, add `this.sortPages();` before `this.loadTranslations();`.

In `ngOnChanges`, inside the existing `if` block, add `this.sortPages();` before `this.loadTranslations();`.

Add methods after `isMetaTool()`:

```ts
  onPageDrop(event: CdkDragDrop<Page[]>): void {
    if (event.previousIndex === event.currentIndex) {
      return;
    }
    const previousOrder = [...this.pages];
    moveItemInArray(this.pages, event.previousIndex, event.currentIndex);
    this.pageService
      .reorder(
        this.resource.id,
        this.pages.map((page) => page.id),
      )
      .then(() => {
        this.pages.forEach((page, index) => (page.position = index));
      })
      .catch((message) => {
        this.pages = previousOrder;
        this.pageErrorMessage = message;
      });
  }

  private sortPages(): void {
    this.pages = [...(this.resource.pages || [])].sort(
      (a, b) => a.position - b.position,
    );
  }
```

(`sortPages` is private; tests exercise it through `ngOnInit`.)

- [ ] **Step 4: Update the template**

In `src/app/components/resource/resource.component.html`, replace the Default Pages `<ul>` (the one iterating `resource.pages`) with:

```html
          <ul
            class="list-group list-group-flush"
            cdkDropList
            (cdkDropListDropped)="onPageDrop($event)"
          >
            <li
              class="list-group-item d-flex justify-content-between align-items-center"
              *ngFor="let page of pages"
              cdkDrag
            >
              <span>
                <i class="fa fa-bars mr-2 text-muted" cdkDragHandle></i>
                {{ page.filename }}
              </span>
              <button
                (click)="openPage(page)"
                class="btn btn-outline-dark float-right"
              >
                <i class="fa fa-pencil"></i> Edit
              </button>
            </li>
            <li class="list-group-item text-danger" *ngIf="pageErrorMessage">
              {{ pageErrorMessage }}
            </li>
            <li class="list-group-item" *ngIf="!(pages.length > 0)">
              No pages added
            </li>
          </ul>
```

(The "No pages added" and empty-state conditions switch from `resource.pages` to `pages`. Rename buttons come in Task B4.)

- [ ] **Step 5: Run tests to verify they pass**

Run: `yarn test --watch=false --browsers=ChromeHeadless`
Expected: `147 SUCCESS` (144 + 3 new).

- [ ] **Step 6: Commit**

```bash
git add src/app/components/resource/resource.component.ts src/app/components/resource/resource.component.html src/app/components/resource/resource.component.spec.ts
git commit -m "GT-1290 Add drag-and-drop page reordering"
```

### Task B4: Inline rename in the resource page list

**Files:**
- Modify: `src/app/components/resource/resource.component.ts`
- Modify: `src/app/components/resource/resource.component.html`
- Test: `src/app/components/resource/resource.component.spec.ts`

- [ ] **Step 1: Write the failing component tests**

In `src/app/components/resource/resource.component.spec.ts`, add another describe block after `'page reordering'`:

```ts
  describe('page renaming', () => {
    beforeEach(() => {
      resource.id = 13;
      resource['latest-drafts-translations'] = [];
      resource['pages'] = [
        buildPage(1, 'first.xml', 0),
        buildPage(2, 'second.xml', 1),
      ];
      resource['tips'] = [];
      comp.ngOnInit();
    });

    it('starts renaming with the current filename', () => {
      comp.startRenamePage(comp.pages[0]);

      expect(comp.renamingPage).toBe(comp.pages[0]);
      expect(comp.renameValue).toBe('first.xml');
    });

    it('saves the new filename and closes the editor', (done) => {
      (pageServiceStub.update as jasmine.Spy).and.returnValue(
        Promise.resolve(null),
      );

      comp.startRenamePage(comp.pages[0]);
      comp.renameValue = 'renamed.xml';
      comp.saveRenamePage(comp.pages[0]);

      setTimeout(() => {
        expect(pageServiceStub.update).toHaveBeenCalledWith(1, {
          filename: 'renamed.xml',
        });
        expect(comp.pages[0].filename).toBe('renamed.xml');
        expect(comp.renamingPage).toBeNull();
        done();
      });
    });

    it('keeps the editor open and shows the error when renaming fails', (done) => {
      (pageServiceStub.update as jasmine.Spy).and.returnValue(
        Promise.reject('filename has already been taken'),
      );

      comp.startRenamePage(comp.pages[0]);
      comp.renameValue = 'second.xml';
      comp.saveRenamePage(comp.pages[0]);

      setTimeout(() => {
        expect(comp.pages[0].filename).toBe('first.xml');
        expect(comp.renamingPage).toBe(comp.pages[0]);
        expect(comp.pageErrorMessage).toBe('filename has already been taken');
        done();
      });
    });

    it('cancel closes the editor without saving', () => {
      comp.startRenamePage(comp.pages[0]);

      comp.cancelRenamePage();

      expect(comp.renamingPage).toBeNull();
      expect(pageServiceStub.update).not.toHaveBeenCalled();
    });
  });
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `yarn test --watch=false --browsers=ChromeHeadless`
Expected: compilation errors — `startRenamePage`, `renameValue`, `renamingPage`, `saveRenamePage`, `cancelRenamePage` don't exist.

- [ ] **Step 3: Implement the component logic**

In `src/app/components/resource/resource.component.ts`, add fields below `pageErrorMessage`:

```ts
  renamingPage: Page = null;
  renameValue = '';
```

Add methods after `onPageDrop`:

```ts
  startRenamePage(page: Page): void {
    this.renamingPage = page;
    this.renameValue = page.filename;
    this.pageErrorMessage = null;
  }

  cancelRenamePage(): void {
    this.renamingPage = null;
    this.pageErrorMessage = null;
  }

  saveRenamePage(page: Page): void {
    this.pageService
      .update(page.id, { filename: this.renameValue })
      .then(() => {
        page.filename = this.renameValue;
        this.renamingPage = null;
      })
      .catch((message) => (this.pageErrorMessage = message));
  }
```

- [ ] **Step 4: Update the template**

In `src/app/components/resource/resource.component.html`, replace the page `<li>` from Task B3 with:

```html
            <li
              class="list-group-item d-flex justify-content-between align-items-center"
              *ngFor="let page of pages"
              cdkDrag
            >
              <ng-container *ngIf="renamingPage !== page">
                <span>
                  <i class="fa fa-bars mr-2 text-muted" cdkDragHandle></i>
                  {{ page.filename }}
                </span>
                <span class="btn-group btn-group-sm">
                  <button
                    (click)="startRenamePage(page)"
                    class="btn btn-outline-dark"
                  >
                    <i class="fa fa-i-cursor"></i> Rename
                  </button>
                  <button (click)="openPage(page)" class="btn btn-outline-dark">
                    <i class="fa fa-pencil"></i> Edit
                  </button>
                </span>
              </ng-container>
              <ng-container *ngIf="renamingPage === page">
                <input
                  class="form-control form-control-sm mr-2"
                  [(ngModel)]="renameValue"
                  (keyup.enter)="saveRenamePage(page)"
                />
                <span class="btn-group btn-group-sm">
                  <button (click)="saveRenamePage(page)" class="btn btn-success">
                    <i class="fa fa-check"></i> Save
                  </button>
                  <button
                    (click)="cancelRenamePage()"
                    class="btn btn-secondary"
                  >
                    <i class="fa fa-times"></i> Cancel
                  </button>
                </span>
              </ng-container>
            </li>
```

(`FormsModule` is already imported app-wide and in the spec's TestBed, so `[(ngModel)]` works.)

- [ ] **Step 5: Run tests to verify they pass**

Run: `yarn test --watch=false --browsers=ChromeHeadless`
Expected: `151 SUCCESS` (147 + 4 new).

- [ ] **Step 6: Commit**

```bash
git add src/app/components/resource/resource.component.ts src/app/components/resource/resource.component.html src/app/components/resource/resource.component.spec.ts
git commit -m "GT-1290 Add inline page rename"
```

### Task B5: Full admin verification

- [ ] **Step 1: Format**

Run: `yarn prettier:write`
Then re-run `yarn test --watch=false --browsers=ChromeHeadless` if it changed any file.

- [ ] **Step 2: Lint**

Run: `yarn lint`
Expected: no errors (autofix applies).

- [ ] **Step 3: Full test run**

Run: `yarn test --watch=false --browsers=ChromeHeadless`
Expected: `151 SUCCESS`.

- [ ] **Step 4: Production build**

Run: `yarn build`
Expected: builds without errors.

- [ ] **Step 5: Commit any formatting/lint fixups**

```bash
git add -A
git commit -m "GT-1290 Lint and formatting fixes" || echo "nothing to commit"
```

---

## Verification (end-to-end, manual)

1. Start the API locally is impractical (env vars, S3); instead rely on the staging API once the API PR is deployed, or verify via specs.
2. Admin smoke test: `yarn start` in the worktree, log in, expand a resource, drag a page row — order persists after reload; rename a page — new filename shows; renaming to a duplicate shows the API error and keeps the editor open.

## Out of scope (from spec)

- Custom pages / tips reorder or rename.
- PR creation is handled afterwards via the finishing-a-development-branch skill (PR titles `GT-1290 (…)`, admin PR references the API PR).
