/* eslint-disable no-console */
import { APIDescription, RestrictedAccessVersion } from '../apiDefs/schema';

export const allowSandboxForm = (api: APIDescription): boolean => {
  if (api.restrictedAccess.blockSandboxAccessForm) {
    return false;
  }
  if (!api.restrictedAccess.versions) {
    return true;
  }
  return !!api.restrictedAccess.versions.some(
    (version: RestrictedAccessVersion) => !version.blockSandboxAccessForm,
  );
};

export const isApiAuthTypeRestricted = (api: APIDescription, authType: string): boolean => {
  if (api.restrictedAccess.restricted) {
    return true;
  }
  return !!api.restrictedAccess.versions?.some(
    (version: RestrictedAccessVersion) => version.authType === authType,
  );
};

export const hasRestrictedAccess = (api: APIDescription): boolean =>
  api.restrictedAccess.restricted || !!api.restrictedAccess.versions;

export const isOnlyOneAuthType = (api: APIDescription): boolean =>
  !api.oAuth || (!!api.oAuthTypes && api.oAuthTypes.length === 1);
