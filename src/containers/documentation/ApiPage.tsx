/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import * as React from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import classNames from 'classnames';
import ReactMarkdown from 'react-markdown';
import { isApiDeactivated, isApiDeprecated } from '../../apiDefs/deprecated';

import { APIDescription } from '../../apiDefs/schema';
import { ApiAlerts, PageHeader } from '../../components';
import { useFlag } from '../../flags';

import { FLAG_API_ENABLED_PROPERTY } from '../../types/constants';
import ApisLoader from '../../components/apisLoader/ApisLoader';
import ApiDocumentation from './ApiDocumentation';
import ApiNotFoundPage from './ApiNotFoundPage';
import { getApi } from './DocumentationRoot';

const DeactivationMessage = ({ api }: { api: APIDescription }): JSX.Element | null => {
  /*
   * This code should be unneeded but is required for the linter. Without this
   * code DeactivationMessage will still return null (isApiDeprecated and
   * isApiDeactivated will both return false when api.deactivationInfo is
   * undefined, resulting in a null return on DeactivationMessage).
   * The linter does not catch this and thinks that api.deactivationInfo could
   * be undefined further down, even though the DeactionMessage would return
   * null before hitting that code.
   */
  if (!api.deactivationInfo) {
    return null;
  }

  const isDeprecated = isApiDeprecated(api);
  const isDeactivated = isApiDeactivated(api);

  if (!isDeprecated && !isDeactivated) {
    return null;
  }

  const { deactivationContent, deprecationContent } = api.deactivationInfo;
  const content = isDeactivated ? deactivationContent : deprecationContent;

  return (
    <div className={classNames('usa-alert', 'usa-alert-info', 'va-api-alert-box')}>
      <div className={classNames('usa-alert-body')}>
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
};

const ApiPage = (): JSX.Element => {
  const params = useParams();
  const enabledApisFlags = useFlag([FLAG_API_ENABLED_PROPERTY]);

  const api = getApi(params.urlSlug);
  if (!api) {
    throw new Error('API not found');
  }

  if (!enabledApisFlags[api.urlFragment]) {
    return (
      <ApisLoader>
        <ApiNotFoundPage />
      </ApisLoader>
    );
  }

  return (
    <>
      <Helmet>
        <title>{api.name} Documentation</title>
      </Helmet>
      <div className="api-docs-wrapper">
        <ApiAlerts />
        <PageHeader header="Docs" subText={api.name} />
        <DeactivationMessage api={api} />
      </div>
      {!isApiDeactivated(api) && (
        <div className="sans-serif-headers">
          <ApiDocumentation apiDefinition={api} />
        </div>
      )}
    </>
  );
};

ApiPage.propTypes = {};
export default ApiPage;
