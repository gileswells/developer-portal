import * as Sentry from '@sentry/browser';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { usePrevious } from 'src/hooks/previous/Previous';
import SwaggerUI from 'swagger-ui';
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
  const prevApiName = usePrevious(props.apiName);
  const prevVersion = usePrevious(version);

  const setSearchParam = React.useCallback(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('version') !== version) {
      console.log('setSearchParam()');
      params.set('version', version);
      history.push(`${history.location.pathname}?${params.toString()}`);
    }
  }, [history, location.search, version]);

  const setMetadataAndDocUrl = React.useCallback(async () => {
    const { openApiUrl, metadataUrl } = props.docSource;
    const currentMetadata = (await getMetadata(metadataUrl)) as string | undefined;

    dispatch(actions.setInitialVersioning(openApiUrl, currentMetadata));
  }, [dispatch, props.docSource]);

  const getMetadata = async (metadataUrl?: string): Promise<any> => {
    if (!metadataUrl) {
      return null;
    }
    try {
      const request = new Request(`${metadataUrl}`, {
        method: 'GET',
      });
      const response = await fetch(request);
      return response.json();
    } catch (error) {
      Sentry.captureException(error);
      return null;
    }
  };

  const renderSwaggerUI = React.useCallback(() => {
    const handleVersionChange = (currentVersion: string) => {
      dispatch(actions.setRequstedApiVersion(currentVersion));
      setSearchParam();
    };
    if (document.getElementById('swagger-ui') && docUrl.length !== 0) {
      console.log('renderSwaggerUI()');
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
  }, [dispatch, docUrl, metadata, setSearchParam, versionNumber]);

  const setupAndRenderSwaggerUI = React.useCallback(async () => {
    await setMetadataAndDocUrl();
    setSearchParam();
    renderSwaggerUI();
  }, [renderSwaggerUI, setMetadataAndDocUrl, setSearchParam]);

  /**
   * componentDidMount()
   */
  React.useLayoutEffect(() => {
    void setupAndRenderSwaggerUI();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * componentDidUpdate()
   */
  React.useLayoutEffect(() => {
    if (prevApiName !== props.apiName) {
      void setupAndRenderSwaggerUI();
    } else if (prevVersion !== version) {
      setSearchParam();
      renderSwaggerUI();
    }
  }, [
    prevApiName,
    prevVersion,
    props.apiName,
    renderSwaggerUI,
    setSearchParam,
    setupAndRenderSwaggerUI,
    version,
  ]); // eslint-disable-line react-hooks/exhaustive-deps

  const { apiIntro } = props.docSource;

  return (
    <React.Fragment>
      {apiIntro && apiIntro({})}
      <div id="swagger-ui" />
    </React.Fragment>
  );
};

export { SwaggerDocs };
