import React from 'react';
import { useFormikContext } from 'formik';
import classNames from 'classnames';
import { Values } from '../../../containers/consumerOnboarding/ProductionAccess';
import { ETHICS_PRINCIPLES_URL } from '../../../types/constants/paths';
import CheckboxRadioField from '../CheckboxRadioField';

import './EthicsPrinciplesCheckbox.scss';

export const EthicsPrinciplesCheckbox = (): JSX.Element => {
  const { errors, touched } = useFormikContext<Values>();
  const hasEthicsPrinciplesError =
    !!errors.ethicsPrinciplesAttested && !!touched.ethicsPrinciplesAttested;
  return (
    <CheckboxRadioField
      label="I attest that I have read, understood, and agree to the Ethics Principles for Access to and Use of Veteran Data."
      name="ethicsPrinciplesAttested"
      required
      type="checkbox"
      description={
        <p className={classNames({ 'vads-u-font-weight--bold': hasEthicsPrinciplesError })}>
          Review our{' '}
          <a href={ETHICS_PRINCIPLES_URL} target="_blank" rel="noopener noreferrer">
            Ethics Principles for Access to and Use of Veteran Data
          </a>
          .<span className="form-required-span">(*Required)</span>
        </p>
      }
      className="vads-u-margin-top--4 ethics-principles-attestation-checkbox"
      showError
    />
  );
};
