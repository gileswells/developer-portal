import * as React from 'react';
import { useSelector } from 'react-redux';
import { isApiDeactivated } from '../../apiDefs/deprecated';
import { getAllOauthApis, lookupApiByFragment } from '../../apiDefs/query';
import { APIDescription } from '../../apiDefs/schema';
import { RootState } from '../../types';
import PKCEAuthContentMDX from './PKCEAuthContent.mdx';

const PKCEAuthContent = (): JSX.Element => {
  const selectedOAuthApi = useSelector((state: RootState) => state.oAuthApiSelection.selectedOAuthApi);
  const apiDef = lookupApiByFragment(selectedOAuthApi);
  const selectorProps = {
    options: getAllOauthApis().filter((item: APIDescription) => !isApiDeactivated(item)),
    selectedOption: selectedOAuthApi,
  };
  const authUrl = `https://sandbox-api.va.gov${apiDef?.oAuthInfo?.baseAuthPath ?? '/oauth2'}/authorization?\n  client_id=0oa1c01m77heEXUZt2p7\n  &redirect_uri=<yourRedirectURL>\n  &response_type=code\n  &scope=${apiDef?.oAuthInfo?.scopes.join(' ') ?? 'profile openid offline_access'}\n  &state=1AOQK33KIfH2g0ADHvU1oWAb7xQY7p6qWnUFiG1ffcUdrbCY1DBAZ3NffrjaoBGQ\n  &code_challenge_method=S256\n  &code_challenge=gNL3Mve3EVRsiFq0H6gfCz8z8IUANboT-eQZgEkXzKw`;
  const codeGrant = 'GET <yourRedirectURL>?\n  code=z92dapo5\n  &state=af0ifjsldkj\nHost: <yourRedirectHost>';
  const postToken = `POST ${apiDef?.oAuthInfo?.baseAuthPath ?? '/oauth2'}/token HTTP/1.1\nHost: sandbox-api.va.gov\nContent-Type: application/x-www-form-urlencoded\n\ngrant_type=authorization_code\n&code=z92dapo5\n&state=af0ifjsldkj\n&redirect_uri=<yourRedirectURL>\n&code_verifier=ccec_bace_d453_e31c_eb86_2ad1_9a1b_0a89_a584_c068_2c96`;
  const postTokenResponse200 = `{\n  "access_token": "SlAV32hkKG",\n  "expires_in": 3600,\n  "refresh_token": "8xLOxBtZp8",\n  "scope": "${apiDef?.oAuthInfo?.scopes.join(' ') ?? 'profile openid offline_access'}",\n  "state": "af0ifjsldkj",\n  "token_type": "Bearer",\n}`;
  const postTokenResponse400 = 'HTTP/1.1 400 Bad Request\nContent-Type: application/json\nCache-Control: no-store\nPragma: no-cache\n\n{\n  "error": "invalid_request"\n}';
  const postTokenRefresh = `POST ${apiDef?.oAuthInfo?.baseAuthPath ?? '/oauth2'}/token HTTP/1.1\nHost: sandbox-api.va.gov\nContent-Type: application/x-www-form-urlencoded\n\ngrant_type=refresh_token\n&refresh_token={your refresh_token}\n&client_id={client_id}\n&scope={${apiDef?.oAuthInfo?.scopes.join(' ') ?? 'profile openid offline_access'}}`;

  const propObj = {
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
    <section aria-labelledby="pkce-authorization">
      <PKCEAuthContentMDX propObj={propObj} />
    </section>
  );
};
PKCEAuthContent.propTypes = {};

export { PKCEAuthContent };
