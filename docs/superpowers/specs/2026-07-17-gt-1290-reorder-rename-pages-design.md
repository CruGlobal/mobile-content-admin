# GT-1290: Admin — reorder and rename pages

**Date:** 2026-07-17
**Jira:** [GT-1290](https://jira.cru.org/browse/GT-1290)
**Repos:** `mobile-content-admin` (this repo) and `CruGlobal/mobile-content-api`

## Problem

The order of pages in a tool is determined by a `position` value stored in the
database, and a page's `filename` is fixed at creation. Today neither can be
changed from the admin tool — a developer with database access has to update
them by hand. Content authors need to reorder pages and rename page filenames
directly from the admin UI.

The API currently blocks this: `PagesController#update` only permits the
`structure` attribute. The `Page` model also validates `position` uniqueness
per resource, so positions cannot be updated one page at a time without
transient conflicts.

## Design

### Part 1 — API (`mobile-content-api`, Rails)

**Rename.** `PagesController#update` additionally permits `:filename`
(alongside the existing `:structure`). The existing
`validates :filename, uniqueness: {scope: :resource}` returns a 422 on
conflict, which the admin surfaces to the author.

**Reorder.** New endpoint `POST /resources/:resource_id/pages/reorder`
(exact route shape to match the repo's existing conventions), authenticated
like other admin writes via `SecureController`. Request body: the complete
ordered array of page IDs for that resource.

Behavior:

- Verify the submitted IDs are exactly the resource's page IDs — otherwise
  respond 422. No partial reorders, so the result is always a consistent
  `0..n-1` numbering.
- In a single transaction, assign `position = index` for each page. Per-row
  uniqueness validation is bypassed (`update_column` or equivalent) because
  uniqueness is guaranteed by construction; the resource is touched once at
  the end.
- Respond with the pages in their new order.

Like all draft edits, neither change affects published translations until the
next publish regenerates the manifest.

**Tests:** RSpec request specs for filename update (success + duplicate 422)
and reorder (success, wrong/missing IDs 422, auth required).

### Part 2 — Admin UI (`mobile-content-admin`, Angular 13)

**New dependency:** `@angular/cdk@13.x` (matches `@angular/core` 13.4.0),
importing `DragDropModule` only.

**Reorder.** The "Default Pages" list in `resource.component.html` becomes a
`cdkDropList` with a drag handle per row. On drop:

1. Optimistically reorder the local `resource.pages` array.
2. Call new `PageService.reorder(resourceId, orderedPageIds)`.
3. On API failure, revert the array to its previous order and show the error.

**Rename.** A pencil button per page row swaps the filename text for an inline
text input with save/cancel:

- Save calls `PageService.update`, extended to send `filename`.
- A 422 (e.g. duplicate filename) shows the error inline and keeps the input
  open; cancel restores the original filename.

**Ordering guarantee.** Pages are explicitly sorted by `position` when
rendered so the list always reflects the database order regardless of API
response ordering.

**Service changes** (`page.service.ts`):

- `update(pageId, structure, filename?)` — include `filename` in the payload
  only when provided, so existing structure-only callers are unchanged.
- `reorder(resourceId, pageIds)` — calls the new API endpoint.

**Tests:** Karma/Jasmine specs following the repo's existing TestBed patterns:

- `PageService`: payload shape for rename and reorder, error propagation.
- Resource component: drop reorders and calls the service; failed reorder
  reverts; rename saves, and a conflict keeps the input open with an error.

## Rollout

- Two PRs titled `GT-1290 (…)`; the admin PR notes it depends on the API PR.
- API deploys first; the admin UI is inert without it (reorder/rename calls
  would 400/422 until the API ships, but no existing behavior changes).
- `know-god-web` is unaffected — it renders published manifests, which already
  reflect page order at publish time.

## Out of scope

- Reordering or renaming custom pages / tips (same pattern could be applied
  later if wanted).
- Drag-and-drop for anything other than the Default Pages list.
