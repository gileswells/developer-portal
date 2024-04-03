import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ApiAlerts, PageHeader } from '../../components';
import { getApi } from './DocumentationRoot';
import './ReleaseNotes.scss';

export const ReleaseNotes = (): JSX.Element => {
  const params = useParams();
  const api = getApi(params.urlSlug);
  if (!api) {
    throw new Error('API not found');
  }

  return (
    <>
      <Helmet>
        <title>{api.name} Release Notes</title>
      </Helmet>
      <ApiAlerts />
      <PageHeader header="Release notes" subText={api.name} />
      <div className="release-notes-wrapper">
        <ReactMarkdown
          components={{
            // eslint-disable-next-line @typescript-eslint/no-unused-vars, jsx-a11y/heading-has-content
            h3: ({ node, ...props }) => <h2 {...props} />,
          }}
        >
          {api.releaseNotes}
        </ReactMarkdown>
      </div>
    </>
  );
};
