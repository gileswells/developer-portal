// https://github.com/mathiasbynens/CSS.escape/blob/master/css.escape.js#L21
// eslint-disable-next-line complexity
const cssEscape = (value: string): string => {
  if (!value) {
    throw new TypeError('`CSS.escape` requires an argument.');
  }
  const str = String(value);
  const { length } = str;
  let index = -1;
  let codeUnit;
  let result = '';
  const firstCodeUnit = str.charCodeAt(0);

  if (
    // If the character is the first character and is a `-` (U+002D), and
    // there is no second character, […]
    length === 1 &&
    firstCodeUnit === 0x002d
  ) {
    return `\\${str}`;
  }

  while (index < length) {
    index += 1;
    codeUnit = str.charCodeAt(index);
    // Note: there’s no need to special-case astral symbols, surrogate
    // pairs, or lone surrogates.

    // If the character is NULL (U+0000), then the REPLACEMENT CHARACTER
    // (U+FFFD).
    if (codeUnit === 0x0000) {
      result += '\uFFFD';
      continue;
    }

    if (
      // If the character is in the range [\1-\1F] (U+0001 to U+001F) or is
      // U+007F, […]
      (codeUnit >= 0x0001 && codeUnit <= 0x001f) ||
      codeUnit === 0x007f ||
      // If the character is the first character and is in the range [0-9]
      // (U+0030 to U+0039), […]
      (index === 0 && codeUnit >= 0x0030 && codeUnit <= 0x0039) ||
      // If the character is the second character and is in the range [0-9]
      // (U+0030 to U+0039) and the first character is a `-` (U+002D), […]
      (index === 1 && codeUnit >= 0x0030 && codeUnit <= 0x0039 && firstCodeUnit === 0x002d)
    ) {
      // https://drafts.csswg.org/cssom/#escape-a-character-as-code-point
      result += `\\${codeUnit.toString(16)} `;
      continue;
    }

    // If the character is not handled by one of the above rules and is
    // greater than or equal to U+0080, is `-` (U+002D) or `_` (U+005F), or
    // is in one of the ranges [0-9] (U+0030 to U+0039), [A-Z] (U+0041 to
    // U+005A), or [a-z] (U+0061 to U+007A), […]
    if (
      codeUnit >= 0x0080 ||
      codeUnit === 0x002d ||
      codeUnit === 0x005f ||
      (codeUnit >= 0x0030 && codeUnit <= 0x0039) ||
      (codeUnit >= 0x0041 && codeUnit <= 0x005a) ||
      (codeUnit >= 0x0061 && codeUnit <= 0x007a)
    ) {
      // the character itself
      result += str.charAt(index);
      continue;
    }

    // Otherwise, the escaped character.
    // https://drafts.csswg.org/cssom/#escape-a-character
    result += `\\${str.charAt(index)}`;
  }
  return result;
};

// https://github.com/swagger-api/swagger-ui/blob/v4.19.1/src/core/utils.js#L145
const isFunc = (thing: unknown): boolean => typeof thing === 'function';

// https://github.com/swagger-api/swagger-ui/blob/v4.19.1/src/core/utils.js#L791
const createDeepLinkPath = (str: unknown): string =>
  typeof str === 'string' || str instanceof String ? str.trim().replace(/\s/g, '%20') : '';

// https://github.com/swagger-api/swagger-ui/blob/v4.19.1/src/core/utils.js#L793
const escapeDeepLinkPath = (str: string): string =>
  cssEscape(createDeepLinkPath(str).replace(/%20/g, '_'));

// https://github.com/swagger-api/swagger-ui/blob/v4.19.1/src/core/utils/url.js#L1
const isAbsoluteUrl = (url: string): RegExpMatchArray | null => url.match(/^(?:[a-z]+:)?\/\//i); // Matches http://, HTTP://, https://, ftp://, //example.com,

// https://github.com/swagger-api/swagger-ui/blob/v4.19.1/src/core/utils/url.js#L5
const addProtocol = (url: string): string => {
  if (!url.match(/^\/\//i)) {
    return url;
  } // Checks if protocol is missing e.g. //example.com
  return `${window.location.protocol}${url}`;
};

// https://github.com/swagger-api/swagger-ui/blob/v4.19.1/src/core/utils/url.js#L11
const buildBaseUrl = (selectedServer: string, specUrl: string): string => {
  if (!selectedServer) {
    return specUrl;
  }
  if (isAbsoluteUrl(selectedServer)) {
    return addProtocol(selectedServer);
  }
  return new URL(selectedServer, specUrl).href;
};

// https://github.com/swagger-api/swagger-ui/blob/v4.19.1/src/core/utils/url.js#L18
const buildUrl = (
  url: string,
  specUrl: string,
  { selectedServer = '' } = {},
): string | undefined => {
  if (!url) {
    return undefined;
  }
  if (isAbsoluteUrl(url)) {
    return url;
  }
  const baseUrl = buildBaseUrl(selectedServer, specUrl);
  if (!isAbsoluteUrl(baseUrl)) {
    return new URL(url, window.location.href).href;
  }
  return new URL(url, baseUrl).href;
};

// https://github.com/swagger-api/swagger-ui/blob/v4.19.1/src/core/utils/url.js#L33
const safeBuildUrl = (
  url: string,
  specUrl: string,
  { selectedServer = '' } = {},
): string | undefined => {
  try {
    return buildUrl(url, specUrl, { selectedServer });
  } catch {
    return undefined;
  }
};

export { createDeepLinkPath, escapeDeepLinkPath, isFunc, safeBuildUrl };
