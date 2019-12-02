import { IApiDescription } from '../schema';

const swaggerHost : string = process.env.REACT_APP_VETSGOV_SWAGGER_API!;
const benefitsApis : IApiDescription[] = [
  {
    description: 'Track appeals',
    docSources: [
      {
        openApiUrl: `${swaggerHost}/services/appeals/docs/v0/api`,
      },
    ],
    enabledByDefault: true,
    name: 'Appeals Status API',
    urlFragment: 'appeals',
    vaInternalOnly: true,
  },
  {
    description: 'Submit and track claims',
    docSources: [
      {
        metadataUrl: `${swaggerHost}/services/claims/metadata`,
        openApiUrl: `${swaggerHost}/services/claims/docs/v0/api`,
      },
    ],
    enabledByDefault: true,
    name: 'Benefits Claims API',
    oAuth: true,
    urlFragment: 'claims',
    vaInternalOnly: false,
  },
  {
    description: 'Manage VA Home Loans',
    docSources: [
      {
        openApiUrl: `${swaggerHost}/services/loan_guaranty/docs/v1/api`,
      },
    ],
    enabledByDefault: false,
    name: 'Loan Guaranty API',
    urlFragment: 'loan_guaranty',
    vaInternalOnly: false,
  },
  {
    description: 'Submit PDF claims',
    docSources: [
      {
        metadataUrl: `${swaggerHost}/services/vba_documents/metadata`,
        openApiUrl: `${swaggerHost}/services/vba_documents/docs/v0/api`,
      },
    ],
    enabledByDefault: true,
    name: 'Benefits Intake API',
    urlFragment: 'benefits',
    vaInternalOnly: false,
  },
];

export default benefitsApis;
