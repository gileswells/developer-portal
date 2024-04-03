import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React from 'react';
import { lookupApiCategory } from '../../apiDefs/query';
import { APIDescription } from '../../apiDefs/schema';

interface VeteranRedirectProps {
  api: APIDescription;
}

export const VeteranRedirect = ({ api }: VeteranRedirectProps): JSX.Element | null => {
  const category = lookupApiCategory(api.categoryUrlFragment);
  const veteranRedirect = api.veteranRedirect ?? category.content.veteranRedirect;

  if (!veteranRedirect) {
    return null;
  }

  return (
    <VaAlert status="info" key={api.urlSlug} visible uswds>
      <p className="vads-u-margin-y--0">
        {veteranRedirect.message}&nbsp;
        <a href={veteranRedirect.linkUrl}>{veteranRedirect.linkText}</a>.
      </p>
    </VaAlert>
  );
};
