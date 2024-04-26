import { Context, Request, Response } from '@frontastic/extension-types';
import { getProjectSettings } from '../commerce-commercetools/actionControllers/ProjectController';
import { dummyAccount, dummyActionContext } from './data-provider';

describe.skip('commerce-commercetools:: Project Functionalities', () => {
  it('should test getProjectSettings | should succeed', async function () {
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

    const res: Response = {
      statusCode: 200,
      body: JSON.stringify({
        name: 'Commercetools Frontend Demo',
        countries: ['DE', 'US', 'CA', 'AU'],
        currencies: ['EUR', 'USD'],
        languages: ['en', 'de'],
      }),
      sessionData: '',
    };
    await expect(getProjectSettings(request, dummyActionContext)).resolves.toEqual(res);
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
