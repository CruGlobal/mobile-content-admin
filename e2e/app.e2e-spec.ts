import { MobileContentAdminPage } from './app.po';

describe('mobile-content-admin App', () => {
  let page: MobileContentAdminPage;

  beforeEach(() => {
    page = new MobileContentAdminPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
