// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  base_url: 'https://mobile-content-api-stage.cru.org/',
  oidc_auth: {
    client_id: '0oa1ll7gg0vVRLctz0h8',
    scope: 'openid profile email',
    response_type: 'code',
    issuer: 'https://signon.okta.com',
    login_result_url: '/auth/okta',
  },
};
