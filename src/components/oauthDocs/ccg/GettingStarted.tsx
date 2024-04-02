import * as React from 'react';
import { SectionHeaderWrapper } from '../../index';
import { PublicKeySteps } from './PublicKeySteps';

const GettingStarted = (): JSX.Element => (
  <>
    <SectionHeaderWrapper heading="Getting Started" id="getting-started" />
    <h3>Generating Public RSA Key and Converting to JWK Format</h3>
    <PublicKeySteps />
    <p>
      Next, get sandbox access. When you request access, provide your RSA public key in JWK format.
      We will send your client ID in an email.
    </p>
  </>
);

GettingStarted.propTypes = {};

export { GettingStarted };
