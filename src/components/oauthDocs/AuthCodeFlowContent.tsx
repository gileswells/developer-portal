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

  const propObj = {
    options: selectorProps.options,
    selectedOption: selectorProps.selectedOption,
  };

  return (
    <section aria-labelledby="authorization-code-flow">
      <AuthCodeFlowContentMDX propObj={propObj} apiDef={apiDef} />
    </section>
  );
};

AuthCodeFlowContent.propTypes = {};

export { AuthCodeFlowContent };
