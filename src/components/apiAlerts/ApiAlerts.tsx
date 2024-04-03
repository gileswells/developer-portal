import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { apiAlerts } from '../../utils/apiAlerts';

export const ApiAlerts = (): JSX.Element => {
  const location = useLocation();

  return (
    <>
      {apiAlerts
        .filter(target => location.pathname.includes(target.path))
        .map(target => (
          <VaAlert key={target.path} status={target.status} visible uswds>
            <p className="vads-u-margin-y--0">{target.content}</p>
          </VaAlert>
        ))}
    </>
  );
};
