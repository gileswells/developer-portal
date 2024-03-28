import * as React from 'react';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import './TestingNotice.scss';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

export const TestingNotice = (): JSX.Element => (
  <div
    className={classNames(
      'va-api-testing-notice',
      'vads-u-color--white',
      'vads-u-font-weight--bold',
      'vads-u-font-size--sm',
      'vads-u-padding-y--0p5',
      'vads-u-padding-left--0p5',
    )}
  >
    <FontAwesomeIcon icon={faExclamationTriangle as IconProp} /> This site is for testing. Please
    click{' '}
    <a className="vads-u-color--white" href="https://developer.va.gov">
      developer.va.gov
    </a>{' '}
    to visit VA API Platform.
  </div>
);
