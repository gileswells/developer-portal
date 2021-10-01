/* eslint-disable no-loop-func -- we need to break up these Jest tests inside loops */
import { Page } from 'puppeteer';
import { mockSwagger, puppeteerHost, testPaths } from './e2eHelpers';

jest.setTimeout(100000);

const viewports = [
  { height: 800, width: 1200 },
  { height: 800, width: 768 },
  { height: 800, width: 375 },
];

const checkScreenshots = async (page: Page, selector: string): Promise<void> => {
  for (const viewport of viewports) {
    await page.setViewport(viewport);
    // eslint-disable-next-line no-promise-executor-return
    await new Promise(resolve => setTimeout(resolve, 500));
    const content = await page.$(selector);
    if (content) {
      const screenshot = await content.screenshot({});
      expect(screenshot).toMatchImageSnapshot();
    } else {
      fail(`Selector ${selector} not found on the page.`);
    }
  }
};

const paths = testPaths.filter(path => path !== '/');

describe('Visual regression test', () => {
  it.each(paths)('renders %s properly', async (path: string) => {
    // Mock swagger requests on docs pages so those pages aren't blank
    if (/^\/explore\/[^\/]+\/docs/.test(path)) {
      await page.setRequestInterception(true);
      page.removeAllListeners('request');
      page.on('request', mockSwagger);
    }

    await page.goto(`${puppeteerHost}${path}`, { waitUntil: 'networkidle0' });
    // Hide any videos that may be on the page
    await page.evaluate(
      'document.querySelectorAll("iframe").forEach((e) => { e.style="visibility: hidden;" });',
    );
    await checkScreenshots(page, 'main');
  });

  it('renders the homepage properly', async () => {
    // Set unlimited timeout on first request, since it may timeout while webpack is compiling.
    await page.goto(`${puppeteerHost}`, { timeout: 0, waitUntil: 'networkidle0' });
    await checkScreenshots(page, 'main');
  });

  it('renders the header properly', async () => {
    await page.goto(`${puppeteerHost}`, { waitUntil: 'networkidle0' });
    await checkScreenshots(page, 'header');
  });

  it('renders the footer properly', async () => {
    await page.goto(`${puppeteerHost}`, { waitUntil: 'networkidle0' });
    await checkScreenshots(page, 'footer');
  });
});
