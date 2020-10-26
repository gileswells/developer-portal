import * as Sentry from '@sentry/browser';
import { History } from 'history';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import SwaggerUI from 'swagger-ui';
import { usePrevious } from '../../hooks';
import * as actions from '../../actions';
import { APIDocSource } from '../../apiDefs/schema';
import { getDocURL, getVersion, getVersionNumber } from '../../reducers/api-versioning';
import { RootState, APIMetadata } from '../../types';
import { SwaggerPlugins, System } from './swaggerPlugins';

import 'swagger-ui-themes/themes/3.x/theme-muted.css';

export interface SwaggerDocsProps {
  apiName: string;
  docSource: APIDocSource;
}

export interface VersionInfo {
  version: string;
  status: string;
  path: string;
  healthcheck: string;
  internal_only: boolean;
}

const getMetadata = async (metadataUrl?: string): Promise<APIMetadata | null> => {
  if (!metadataUrl) {
    return null;
  }
  try {
    const request = new Request(`${metadataUrl}`, {
      method: 'GET',
    });
    const response = await fetch(request);
    return response.json() as Promise<APIMetadata>;
  } catch (error) {
    Sentry.captureException(error);
    return null;
  }
};

const setSearchParam = (history: History, queryString: string, version: string) => {
  const params = new URLSearchParams(queryString);
  if (params.get('version') !== version) {
    params.set('version', version);
    history.push(`${history.location.pathname}?${params.toString()}`);
  }
};

const renderSwaggerUI = (
  dispatch: React.Dispatch<actions.SetRequestedAPIVersion>,
  docUrl: string,
  versionNumber: string,
  metadata: APIMetadata | null,
) => {
  const handleVersionChange = (requestedVersion: string) => {
    dispatch(actions.setRequstedApiVersion(requestedVersion));
  };
  if (document.getElementById('swagger-ui') && docUrl.length !== 0) {
    const plugins = SwaggerPlugins(handleVersionChange);
    const ui: System = SwaggerUI({
      dom_id: '#swagger-ui',
      layout: 'ExtendedLayout',
      plugins: [plugins],
      url: docUrl,
    }) as System;
    ui.versionActions.setApiVersion(versionNumber);
    ui.versionActions.setApiMetadata(metadata as APIMetadata);
  }
};

const SwaggerDocs = (props: SwaggerDocsProps): JSX.Element => {
  const dispatch: React.Dispatch<
    actions.SetRequestedAPIVersion | actions.SetInitialVersioning
  > = useDispatch();

  const docUrl = useSelector((state: RootState) => getDocURL(state.apiVersioning));
  const metadata = useSelector((state: RootState) => state.apiVersioning.metadata);
  const version = useSelector((state: RootState) => getVersion(state.apiVersioning));
  const versionNumber = useSelector((state: RootState) => getVersionNumber(state.apiVersioning));

  const history = useHistory();
  const location = useLocation();

  const { apiName } = props;

  const prevApiName = usePrevious(apiName);
  const prevVersion = usePrevious(version);

  const { openApiUrl, metadataUrl } = props.docSource;

  const setMetadataAndDocUrl = async () => {
    const currentMetadata = await getMetadata(metadataUrl);

    dispatch(actions.setInitialVersioning(openApiUrl, currentMetadata));
  };

  if (prevApiName !== apiName) {
    void setMetadataAndDocUrl();
  }

  /**
   * Clear state on unmount
   */
  React.useEffect(
    () => () => {
      dispatch(actions.setInitialVersioning('', null));
    },
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );

  React.useEffect(() => {
    let navigating = false;

    if (prevVersion !== version) {
      navigating = true;
      setSearchParam(history, location.search, version);
    }

    if (!navigating) {
      renderSwaggerUI(dispatch, docUrl, versionNumber, metadata);
    }
  }, [dispatch, docUrl, history, location.search, prevVersion, version, versionNumber, metadata]);

  const { apiIntro } = props.docSource;

  return (
    <React.Fragment>
      {apiIntro && apiIntro({})}
      <div id="swagger-ui" />
    </React.Fragment>
  );
};

export { SwaggerDocs };
