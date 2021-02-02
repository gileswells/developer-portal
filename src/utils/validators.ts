import { ErrorableInput } from 'src/types';

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PRESENCE_PATTERN = /^(?!\s*$).+/;

export const validateByPattern = (
  newValue: ErrorableInput,
  pattern: RegExp,
  failMsg: string,
): void => {
  if (!pattern.test(newValue.value)) {
    newValue.validation = failMsg;
  }
};

export const validateEmail = (newValue: ErrorableInput): ErrorableInput => {
  validateByPattern(newValue, EMAIL_REGEX, 'Must be a valid email address.');
  return newValue;
};

export const validateOAuthRedirectURI = (newValue: ErrorableInput): ErrorableInput => {
  const partialUrlPattern = /^http[s]?:[/][/][^/:?#]+(:[0-9]+)?([/][^?#]*)?$/;
  validateByPattern(newValue, partialUrlPattern, 'Must be an http or https URI.');
  return newValue;
};

export const validatePresence = (newValue: ErrorableInput, fieldName: string): ErrorableInput => {
  validateByPattern(newValue, PRESENCE_PATTERN, `${fieldName} must not be blank.`);
  return newValue;
};

export const validatePresenceFormik = (fieldName: string, value: string): string | undefined => {
  if (!PRESENCE_PATTERN.test(value)) {
    return `${fieldName} must not be blank.`;
  }

  return undefined;
};

export const validateEmailFormik = (value: string): string | undefined => {
  if (!EMAIL_REGEX.test(value)) {
    return 'Must be a valid email address.';
  }

  return undefined;
};
