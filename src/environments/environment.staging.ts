export const environment = {
  production: true,
  base_url: 'https://mobile-content-api-stage.cru.org/',
  oidc_auth: {
    client_id: '0oa1ll7gg0vVRLctz0h8',
    scope: 'openid profile email',
    response_type: 'code',
    issuer: 'https://signon.okta.com',
    login_result_url: '/auth/okta',
  },
};
