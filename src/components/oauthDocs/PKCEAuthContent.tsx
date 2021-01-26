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

  const propObj = {
    options: selectorProps.options,
    selectedOption: selectorProps.selectedOption,
  };

  return (
    <section aria-labelledby="pkce-authorization">
      <PKCEAuthContentMDX propObj={propObj} apiDef={apiDef} />
    </section>
  );
};
PKCEAuthContent.propTypes = {};

export { PKCEAuthContent };
