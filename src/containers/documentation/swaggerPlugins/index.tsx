/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { curlify } from './curlify';
import ExtendedLayout from './ExtendedLayout';
import OperationTag from './OperationTag';
import InfoContainer from './InfoContainer';
import './StyleOverride.scss';
import { VersionActions } from './VersionActions';
import { VersionReducers } from './VersionReducers';
import { VersionSelector } from './VersionSelector';
import { WrapHighlightCode } from './WrapHighlightCode';
import { WrapParameters } from './WrapParameters';
import { SwaggerPlugins as Plugins } from './types';

export * from './types';

const allowTryItOutSelector = (): boolean => false;
const SwaggerPlugins = (versionHandler: (newVersion: string) => void): Plugins => ({
  components: {
    ExtendedLayout,
    InfoContainer,
    OperationTag,
    ServersContainer: (): null => null,
    authorizeBtn: (): null => null,
  },
  fn: {
    curlify,
  },
  statePlugins: {
    spec: {
      wrapSelectors: {
        allowTryItOutFor: (): (() => boolean) => allowTryItOutSelector,
      },
    },
    version: {
      ...VersionActions(versionHandler),
      ...VersionReducers,
      ...VersionSelector,
    },
  },
  wrapComponents: {
    ...WrapHighlightCode,
    ...WrapParameters,
  },
});

export { SwaggerPlugins };
