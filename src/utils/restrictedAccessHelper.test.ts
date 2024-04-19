import { APIDescription, ProdAccessFormSteps } from '../apiDefs/schema';
import {
  allowSandboxForm,
  hasRestrictedAccess,
  isApiAuthTypeRestricted,
  isOnlyOneAuthType,
} from './restrictedAccessHelper';

const releaseNotes: string = 'My API&apos;s release notes';
const api: APIDescription = {
  altID: null,
  categoryUrlFragment: 'nothing-of-importance',
  categoryUrlSlug: 'nothing-of-importance',
  description: "it's a great API!",
  docSources: [
    {
      metadataUrl: 'http://localhost/my/openapi/metadata',
    },
  ],
  enabledByDefault: true,
  isStealthLaunched: false,
  lastProdAccessStep: ProdAccessFormSteps.Three,
  name: 'My API',
  oAuth: false,
  oAuthInfo: null,
  oAuthTypes: null,
  openData: false,
  overviewPageContent: '## Default overview page content',
  releaseNotes,
  restrictedAccess: {
    restricted: false,
  },
  urlFragment: 'my_api',
  urlSlug: 'my-api',
  veteranRedirect: null,
};

describe('restrictedAccessHelper methods', () => {
  it('allowSandboxForm unrestricted', () => {
    const result = allowSandboxForm(api);
    expect(result).toBe(true);
  });

  it('allowSandboxForm fully restricted', () => {
    const test: APIDescription = {
      ...api,
      restrictedAccess: {
        restricted: true,
      },
    };
    const result = allowSandboxForm(test);
    expect(result).toBe(true);
  });

  it('allowSandboxForm blockSandboxAccessForm = true', () => {
    const test: APIDescription = {
      ...api,
      restrictedAccess: {
        blockSandboxAccessForm: true,
        restricted: true,
      },
    };
    const result = allowSandboxForm(test);
    expect(result).toBe(false);
  });

  it('allowSandboxForm single version restricted', () => {
    const test: APIDescription = {
      ...api,
      restrictedAccess: {
        restricted: false,
        versions: [
          {
            authType: 'ccg',
            blockSandboxAccessForm: false,
            version: 'v1',
          },
        ],
      },
    };
    const result = allowSandboxForm(test);
    expect(result).toBe(true);
  });

  it('allowSandboxForm single version sandbox access blocked', () => {
    const test: APIDescription = {
      ...api,
      restrictedAccess: {
        blockSandboxAccessForm: false,
        restricted: false,
        versions: [
          {
            authType: 'ccg',
            blockSandboxAccessForm: true,
            version: 'v1',
          },
        ],
      },
    };
    const result = allowSandboxForm(test);
    expect(result).toBe(false);
  });

  it('isApiAuthTypeRestricted (unrestricted no versions)', () => {
    const test: APIDescription = {
      ...api,
    };
    const result = isApiAuthTypeRestricted(test, 'apikey');
    expect(result).toBe(false);
  });

  it('isApiAuthTypeRestricted apikey (all restricted)', () => {
    const test: APIDescription = {
      ...api,
      restrictedAccess: {
        restricted: true,
      },
    };
    const result = isApiAuthTypeRestricted(test, 'apikey');
    expect(result).toBe(true);
  });

  it('isApiAuthTypeRestricted apikey (acg restricted)', () => {
    const test: APIDescription = {
      ...api,
      restrictedAccess: {
        restricted: false,
        versions: [
          {
            authType: 'acg',
            version: 'v1',
          },
        ],
      },
    };
    const result = isApiAuthTypeRestricted(test, 'apikey');
    expect(result).toBe(false);
  });

  it('isApiAuthTypeRestricted acg (acg restricted)', () => {
    const test: APIDescription = {
      ...api,
      restrictedAccess: {
        restricted: false,
        versions: [
          {
            authType: 'acg',
            version: 'v1',
          },
        ],
      },
    };
    const result = isApiAuthTypeRestricted(test, 'acg');
    expect(result).toBe(true);
  });

  it('hasRestrictedAccess unrestricted', () => {
    const test: APIDescription = {
      ...api,
    };
    const result = hasRestrictedAccess(test);
    expect(result).toBe(false);
  });

  it('hasRestrictedAccess restricted', () => {
    const test: APIDescription = {
      ...api,
      restrictedAccess: { restricted: true },
    };
    const result = hasRestrictedAccess(test);
    expect(result).toBe(true);
  });

  it('hasRestrictedAccess a restricted version', () => {
    const test: APIDescription = {
      ...api,
      restrictedAccess: {
        restricted: false,
        versions: [
          {
            authType: 'ccg',
            version: 'v1,',
          },
        ],
      },
    };
    const result = hasRestrictedAccess(test);
    expect(result).toBe(true);
  });

  it('isOnlyOneAuthType just apikey', () => {
    const test: APIDescription = {
      ...api,
      oAuth: false,
      oAuthTypes: [],
    };
    const result = isOnlyOneAuthType(test);
    expect(result).toBe(true);
  });

  it('isOnlyOneAuthType just acg', () => {
    const test: APIDescription = {
      ...api,
      oAuth: true,
      oAuthTypes: ['AuthorizationCodeGrant'],
    };
    const result = isOnlyOneAuthType(test);
    expect(result).toBe(true);
  });

  it('isOnlyOneAuthType acg and ccg', () => {
    const test: APIDescription = {
      ...api,
      oAuth: true,
      oAuthTypes: ['AuthorizationCodeGrant', 'ClientCredentialsGrant'],
    };
    const result = isOnlyOneAuthType(test);
    expect(result).toBe(false);
  });
});
