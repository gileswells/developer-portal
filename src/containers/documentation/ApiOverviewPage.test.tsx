import { cleanup, render, waitFor, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { fakeCategories } from '../../__mocks__/fakeCategories';
import { AppFlags, FlagsProvider, getFlags } from '../../flags';
import store from '../../store';
import * as apiDefs from '../../apiDefs/query';
import { APICategory, APIDescription } from '../../apiDefs/schema';
import ApiOverviewPage from './ApiOverviewPage';

const renderApiPage = async (
  flags: AppFlags,
  initialRoute: string,
  componentPath?: string,
): Promise<void> => {
  await waitFor(() => cleanup());
  render(
    <Provider store={store}>
      <FlagsProvider flags={flags}>
        <MemoryRouter initialEntries={[initialRoute]}>
          <Routes>
            <Route
              path={componentPath ? componentPath : '/explore/api/:urlSlug'}
              element={<ApiOverviewPage />}
            />
          </Routes>
        </MemoryRouter>
      </FlagsProvider>
    </Provider>,
  );
};

describe('ApiOverviewPage', () => {
  const defaultFlags: AppFlags = {
    ...getFlags(),
    enabled: { rings: true, silmarils: true },
  };
  const lotrRingsApi = fakeCategories.lotr.apis[0];

  const lookupApiByFragmentMock = jest.spyOn(apiDefs, 'lookupApiBySlug');
  const lookupApiCategoryMock = jest.spyOn(apiDefs, 'lookupApiCategory');

  beforeEach(async () => {
    lookupApiByFragmentMock.mockReturnValue(lotrRingsApi);
    lookupApiCategoryMock.mockReturnValue(fakeCategories.lotr);
    await waitFor(() => cleanup());
    render(
      <Provider store={store}>
        <FlagsProvider flags={getFlags()}>
          <MemoryRouter initialEntries={['/explore/api/rings/release-notes']}>
            <Routes>
              <Route path="/explore/api/:urlSlug/release-notes" element={<ApiOverviewPage />} />
            </Routes>
          </MemoryRouter>
        </FlagsProvider>
      </Provider>,
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Static Content', () => {
    it('renders the page header', () => {
      const heading = screen.getByRole('heading', { level: 1, name: 'Rings API' });
      expect(heading).toBeInTheDocument();
    });

    it('renders a link to the docs', () => {
      const link = screen.getByRole('link', { name: 'Read the docs' });
      expect(link).toHaveAttribute('href', '/explore/api/rings/docs');
    });
  });

  describe('API Overview Page Dynamic Content', () => {
    it('renders the heading', () => {
      const heading = screen.getByRole('heading', { level: 3, name: 'With this API you can' });
      expect(heading).toBeInTheDocument();
    });

    it('renders the lists', () => {
      const list = screen.getByRole('list');
      expect(list).toHaveTextContent('Rule them all');
      expect(list).toHaveTextContent('Find them');
      expect(list).toHaveTextContent('Bring them all');
      expect(list).toHaveTextContent('And in the darkness bind them');
    });

    it('renders links', () => {
      const link = screen.getByRole('link', { name: 'Start developing' });
      expect(link).toHaveAttribute('href', '/explore/api/rings/sandbox-access');
    });
  });
  describe('given api with veteran redirect', () => {
    const api: APIDescription = {
      ...lotrRingsApi,
      veteranRedirect: {
        linkText: 'Find a faster train',
        linkUrl: 'https://www.va.gov/find-locations/',
        message: 'Are you tired of waiting?',
      },
    };
    const apiCategory: APICategory = {
      ...fakeCategories.lotr,
      apis: [
        {
          ...lotrRingsApi,
          veteranRedirect: {
            linkText: 'Find a faster train',
            linkUrl: 'https://www.va.gov/find-locations/',
            message: 'Are you tired of waiting?',
          },
        },
        {
          ...lotrRingsApi,
        },
      ],
      content: {
        ...fakeCategories.lotr.content,
        veteranRedirect: {
          linkText: "Find the facility that's right for you.",
          linkUrl: 'https://www.va.gov/find-locations/',
          message: 'Are you a Veteran?',
        },
      },
    };

    it('renders API specific veteran redirect message', async () => {
      lookupApiByFragmentMock.mockReturnValue(api);
      lookupApiCategoryMock.mockReturnValue(apiCategory);
      await renderApiPage(defaultFlags, '/explore/api/rings');
      expect(screen.getByText('Find a faster train')).not.toBeNull();
    });
  });
});
