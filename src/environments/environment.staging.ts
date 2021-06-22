export const environment = {
  production: true,
  base_url: 'https://mobile-content-api-stage.cru.org/',
  oidc_auth: {
    client_id: '0oa1ll7gg0vVRLctz0h8',
    client_secret: '738c0f49-b689-437a-9920-4f4f1fbfb7bb',
    scope: 'openid profile email',
    response_type: 'code',
    issuer: 'https://signon.okta.com',
    login_result_url: '/login/callback',
  },
};
