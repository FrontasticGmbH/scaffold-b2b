import { Context, Request, Response } from '@frontastic/extension-types';

import { getProjectSettings } from '../commerce-commercetools/actionControllers/ProjectController';
import { dummyAccount, dummyActionContext } from './data-provider';

describe.skip('commerce-commercetools:: Project Functionalities', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('should test getProjectSettings | should succeed', async function () {
    const mockResponse: Response = {
      statusCode: 200,
      body: JSON.stringify({
        name: 'Commercetools Frontend Demo',
        countries: ['DE', 'US', 'CA', 'AU'],
        currencies: ['EUR', 'USD'],
        languages: ['en', 'de'],
      }),
      sessionData: '',
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => JSON.parse(mockResponse.body),
      text: async () => mockResponse.body,
    });

    const request: Request = {
      body: JSON.stringify(dummyAccount),
      sessionData: '',
      headers: {
        'commercetools-locale': 'en_US',
      },
      path: '',
      method: 'POST',
      query: '',
    };

    await expect(getProjectSettings(request, dummyActionContext)).resolves.toEqual(mockResponse);
  });

  it('should test getProjectSettings | should fail', async function () {
    const request: Request = {
      body: JSON.stringify(dummyAccount),
      sessionData: '',
      headers: {
        'commercetools-frontend-locale': 'en_US',
      },
      path: '',
      method: 'POST',
      query: '',
    };

    const ctx = {
      environment: 'dev',
      project: {},
      projectConfiguration: {},
      locale: 'en_US',
      featureFlags: {},
    } as Context;

    const mockDummyActionContext = {
      frontasticContext: ctx,
    };

    await expect(getProjectSettings(request, mockDummyActionContext)).rejects.toThrow(
      "Cannot read property 'commercetools' of undefined",
    );
  });
});
