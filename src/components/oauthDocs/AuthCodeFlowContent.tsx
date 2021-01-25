import * as React from 'react';
import { useSelector } from 'react-redux';
import { isApiDeactivated } from '../../apiDefs/deprecated';
import { getAllOauthApis, lookupApiByFragment } from '../../apiDefs/query';
import { APIDescription } from '../../apiDefs/schema';
import { RootState } from '../../types';
import AuthCodeFlowContentMDX from './AuthCodeFlowContent.mdx';

const AuthCodeFlowContent = (): JSX.Element => {
  const selectedOAuthApi = useSelector((state: RootState) => state.oAuthApiSelection.selectedOAuthApi);
  const apiDef = lookupApiByFragment(selectedOAuthApi);
  const selectorProps = {
    options: getAllOauthApis().filter((item: APIDescription) => !isApiDeactivated(item)),
    selectedOption: selectedOAuthApi,
  };
  const authUrl = `https://sandbox-api.va.gov${apiDef?.oAuthInfo?.baseAuthPath ?? '/oauth2'}/authorization?\n  client_id=0oa1c01m77heEXUZt2p7\n  &redirect_uri=<yourRedirectURL>\n  &response_type=code\n  &scope=${apiDef?.oAuthInfo?.scopes.join(' ') ?? 'profile openid offline_access'}\n  &state=1AOQK33KIfH2g0ADHvU1oWAb7xQY7p6qWnUFiG1ffcUdrbCY1DBAZ3NffrjaoBGQ\n  &nonce=o5jYpLSe29RBHBsn5iAnMKYpYw2Iw9XRBweacc001hRo5xxJEbHuniEbhuxHfVZy`;
  const codeGrant = 'GET <yourRedirectURL>?\n  code=z92dapo5\n  &state=af0ifjsldkj\nHost: <yourRedirectHost>';
  const postToken = `POST ${apiDef?.oAuthInfo?.baseAuthPath ?? '/oauth2'}/token HTTP/1.1\nHost: sandbox-api.va.gov\nContent-Type: application/x-www-form-urlencoded\nAuthorization: Basic { base64 encoded *client_id* + ':' + *client_secret* }\n\ngrant_type=authorization_code\n&code=z92dapo5&state=af0ifjsldkj\n&redirect_uri=<yourRedirectURL>`;
  const postTokenResponse200 = `HTTP/1.1 200 OK\nContent-Type: application/json\nCache-Control: no-store\nPragma: no-cache\n\n{\n  "access_token": "SlAV32hkKG",\n  "expires_in": 3600,\n  "refresh_token": "8xLOxBtZp8",\n  "scope": "${apiDef?.oAuthInfo?.scopes.join(' ') ?? 'profile openid offline_access'}",\n  "patient": "1558538470",\n  "state": "af0ifjsldkj",\n  "token_type": "Bearer",\n}`;
  const postTokenResponse400 = 'HTTP/1.1\n400 Bad Request\nContent-Type: application/json\nCache-Control: no-store\nPragma: no-cache\n\n{\n  "error": "invalid_request"\n}';
  const postTokenRefresh = `POST ${apiDef?.oAuthInfo?.baseAuthPath ?? '/oauth2'}/revoke HTTP/1.1\nHost: sandbox-api.va.gov\nContent-Type: application/x-www-form-urlencoded\nAuthorization: Basic { base64 encoded *client_id* + ':' + *client_secret* }\n\ntoken={ *refresh_token* }&token_type_hint=refresh_token`;
  const authManageAccount = `POST ${apiDef?.oAuthInfo?.baseAuthPath ?? '/oauth2'}/token HTTP/1.1\nHost: sandbox-api.va.gov`;
  const authRevokeTokenAccess = `POST ${apiDef?.oAuthInfo?.baseAuthPath ?? '/oauth2'}/revoke HTTP/1.1\nHost: sandbox-api.va.gov\nContent-Type: application/x-www-form-urlencoded\nAuthorization: Basic { base64 encoded *client_id* + ':' + *client_secret* }\n\ntoken={ *access_token* }&token_type_hint=access_token`;
  const authRevokeTokenRefresh = `POST ${apiDef?.oAuthInfo?.baseAuthPath ?? '/oauth2'}/revoke HTTP/1.1\nHost: sandbox-api.va.gov\nContent-Type: application/x-www-form-urlencoded\nAuthorization: Basic { base64 encoded *client_id* + ':' + *client_secret* }\n\ntoken={ *refresh_token* }&token_type_hint=refresh_token`;
  const authRevokeGrant = `DELETE ${apiDef?.oAuthInfo?.baseAuthPath ?? '/oauth2'}/grants HTTP/1.1\nHost: sandbox-api.va.gov\nContent-Type: application/x-www-form-urlencoded\n\n{\n  "client_id": {client_id},\n  "email": {test account email}\n}`;
  const authRevokeGrantError = 'HTTP/1.1 400 Bad Request\nContent-Type: application/json\nCache-Control: no-store\nPragma: no-cache\n\n{\n  "error": "invalid_request",\n  "error_description": "Invalid email address."\n}';

  const propObj = {
    authManageAccount,
    authRevokeGrant,
    authRevokeGrantError,
    authRevokeTokenAccess,
    authRevokeTokenRefresh,
    authUrl,
    codeGrant,
    options: selectorProps.options,
    postToken,
    postTokenRefresh,
    postTokenResponse200,
    postTokenResponse400,
    selectedOption: selectorProps.selectedOption,
  };

  return (
    <section aria-labelledby="authorization-code-flow">
      <AuthCodeFlowContentMDX propObj={propObj} />
    </section>
  );
};

AuthCodeFlowContent.propTypes = {};

export { AuthCodeFlowContent };
