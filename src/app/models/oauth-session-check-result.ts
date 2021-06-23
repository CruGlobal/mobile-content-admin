import { AuthConfig, UserInfo } from 'angular-oauth2-oidc';
import { environment } from '../../environments/environment';

export interface IOauthSessionCheckResult {
  hasValidSession: boolean;
  user?: UserInfo;
  erroredAt?: string;
  error?: string;
}

export const oauthConfig: AuthConfig = {
  issuer: environment.oidc_auth.issuer,
  redirectUri: window.location.origin + environment.oidc_auth.login_result_url,
  clientId: environment.oidc_auth.client_id,
  responseType: environment.oidc_auth.response_type,
  scope: environment.oidc_auth.scope,
  strictDiscoveryDocumentValidation: true,
  requireHttps: false,
  showDebugInformation: true,
};
