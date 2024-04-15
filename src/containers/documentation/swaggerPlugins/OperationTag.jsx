import React from 'react';
import { sanitizeUrl } from '@braintree/sanitize-url';
import { createDeepLinkPath, escapeDeepLinkPath, isFunc, safeBuildUrl } from './utils';

// https://github.com/swagger-api/swagger-ui/blob/v4.19.1/src/core/components/operation-tag.jsx
const OperationTag = props => {
  const {
    tagObj,
    children,
    oas3Selectors,
    layoutSelectors,
    layoutActions,
    getConfigs,
    getComponent,
    specUrl,
  } = props;

  let { tag } = props;

  const { docExpansion, deepLinking } = getConfigs();

  const isDeepLinkingEnabled = deepLinking && deepLinking !== 'false';

  const Collapse = getComponent('Collapse');
  const Markdown = getComponent('Markdown', true);
  const DeepLink = getComponent('DeepLink');
  const Link = getComponent('Link');

  const tagDescription = tagObj.getIn(['tagDetails', 'description'], null);
  const tagExternalDocsDescription = tagObj.getIn(['tagDetails', 'externalDocs', 'description']);
  const rawTagExternalDocsUrl = tagObj.getIn(['tagDetails', 'externalDocs', 'url']);
  let tagExternalDocsUrl;
  if (isFunc(oas3Selectors) && isFunc(oas3Selectors.selectedServer)) {
    tagExternalDocsUrl = safeBuildUrl(rawTagExternalDocsUrl, specUrl, {
      selectedServer: oas3Selectors.selectedServer(),
    });
  } else {
    tagExternalDocsUrl = rawTagExternalDocsUrl;
  }

  if (typeof tag !== 'string') {
    tag = Array.from(tag).join(', ');
  }

  const isShownKey = ['operations-tag', tag];
  const showTag = layoutSelectors.isShown(
    isShownKey,
    docExpansion === 'full' || docExpansion === 'list',
  );

  const id = isShownKey.map(v => escapeDeepLinkPath(v)).join('-');

  return (
    <div className={showTag ? 'opblock-tag-section is-open' : 'opblock-tag-section'}>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
      <h3
        onClick={() => layoutActions.show(isShownKey, !showTag)}
        className={tagDescription ? 'opblock-tag' : 'opblock-tag no-desc'}
        id={id}
        data-tag={tag}
        data-is-open={showTag}
      >
        {isDeepLinkingEnabled ? (
          <DeepLink
            enabled={isDeepLinkingEnabled}
            isShown={showTag}
            path={createDeepLinkPath(tag)}
            text={tag}
          />
        ) : (
          <span>{tag}</span>
        )}
        {tagDescription ? (
          <small>
            <Markdown source={tagDescription} />
          </small>
        ) : (
          <small />
        )}

        {tagExternalDocsUrl ? (
          <div className="info__externaldocs">
            <small>
              <Link
                href={sanitizeUrl(tagExternalDocsUrl)}
                onClick={e => e.stopPropagation()}
                target="_blank"
              >
                {tagExternalDocsDescription || tagExternalDocsUrl}
              </Link>
            </small>
          </div>
        ) : null}

        <button
          aria-expanded={showTag}
          className="expand-operation"
          title={`${tag} endpoints`}
          onClick={() => layoutActions.show(isShownKey, !showTag)}
          type="button"
        >
          <svg className="arrow" width="20" height="20" aria-hidden="true" focusable="false">
            <use
              href={showTag ? '#large-arrow-up' : '#large-arrow-down'}
              xlinkHref={showTag ? '#large-arrow-up' : '#large-arrow-down'}
            />
          </svg>
        </button>
      </h3>
      <Collapse isOpened={showTag}>{children}</Collapse>
    </div>
  );
};

export default OperationTag;
