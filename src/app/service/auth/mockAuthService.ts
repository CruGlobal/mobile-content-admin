export class MockAuthService {
  getAuthorizationAndOptions() {
    return {
      headers: {
        'Content-Type': 'application/vnd.api+json',
        Authorization: 'Bearer test-token',
      },
    };
  }
}

export const requestHasAuthenticatedHeaders = (req: any) => {
  expect(req.request.headers.get('Content-Type')).toBe(
    'application/vnd.api+json',
  );
  expect(req.request.headers.has('Authorization')).toBe(true);
};
