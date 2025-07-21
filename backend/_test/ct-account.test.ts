import { Request } from '@frontastic/extension-types';
import { login, register, requestReset } from '../commerce-commercetools/actionControllers/AccountController';
import { Account } from '../../types/account/Account';
import { createFakeUser, dummyAccount, dummyActionContext, generateFakeEmailAddress } from './data-provider';

describe.skip('commerce-commercetools:: Account Functionalities', () => {
  beforeEach(() => {
    jest.setTimeout(100000);
    global.fetch = jest.fn(); // reset before every test
  });

  it('should test successful account login', async function () {
    const mockResponse = {
      accountId: 'mock-id-123',
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockResponse,
      text: async () => JSON.stringify(mockResponse),
    });

    const request: Request = {
      body: JSON.stringify({
        email: 'test-account@commercetools.com',
        password: '1234',
      }),
      sessionData: '',
      headers: {
        'commercetools-frontend-locale': 'en_GB',
      },
      path: '',
      method: 'POST',
      query: '',
    };

    const response = await login(request, dummyActionContext);

    expect(response.statusCode).toEqual(200);
    const responseBody = JSON.parse(response.body);
    expect(responseBody).toHaveProperty('accountId');
    expect(response.sessionData).toHaveProperty('accountId');
  });

  it('should test account registration - fail as locale is missing', async function () {
    const request: Request = {
      body: JSON.stringify(dummyAccount),
      sessionData: '',
      headers: {},
      path: '',
      method: 'POST',
      query: '',
    };

    await expect(register(request, dummyActionContext)).rejects.toThrow('Locale is missing from request');
  });

  it('should test failed account registration', async function () {
    const mockResponse = {
      statusCode: 400,
      message: `The account test-account@commercetools.com does already exist.`,
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => mockResponse,
      text: async () => JSON.stringify(mockResponse),
    });

    const request: Request = {
      body: JSON.stringify({
        account: dummyAccount,
      }),
      sessionData: '',
      headers: {
        'commercetools-frontend-locale': 'en_GB',
      },
      path: '',
      method: 'POST',
      query: '',
    };

    await expect(register(request, dummyActionContext)).rejects.toThrow(
      `The account test-account@commercetools.com does already exist.`,
    );
  });

  it("should fail resetPassword as account doesn't exists", async function () {
    const email = generateFakeEmailAddress();

    const request: Request = {
      body: JSON.stringify({
        account: {
          ...dummyAccount,
          email,
        },
      }),
      sessionData: '',
      headers: {
        'commercetools-frontend-locale': 'en_GB',
      },
      path: '',
      method: 'POST',
      query: '',
    };

    const { projectKey } = dummyActionContext.frontasticContext.project.configuration.commercetools;
    const expectedError = `URI not found: /${projectKey}/customers/password-token`;

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ message: expectedError }),
      text: async () => JSON.stringify({ message: expectedError }),
    });

    await expect(requestReset(request, dummyActionContext)).rejects.toThrow(expectedError);
  });

  it('should succeed resetPassword as account does exist', async function () {
    const email = await createFakeUser();
    if (!email) return;

    const request: Request = {
      body: JSON.stringify({
        account: {
          ...dummyAccount,
          email,
        },
      }),
      sessionData: '',
      headers: {
        'commercetools-frontend-locale': 'en_GB',
        'commercetools-frontend-currency': 'EUR',
      },
      path: '',
      method: 'POST',
      query: '',
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({}),
      text: async () => '{}',
    });

    const response = await requestReset(request, dummyActionContext);
    expect(response).toEqual({ statusCode: 200, body: '{}', sessionData: { account: undefined } });
  });

  /*
  WARNING ❗️⚠️
  DO NOT RUN THIS TEST UNLESS YOU REALLY WANT TO
  This test will create new data and trigger an email to the generated email.
  It is set to be skipped by default for this reason.
   */
  it.skip('should test successful account registration', async function () {
    const email = generateFakeEmailAddress();
    const request: Request = {
      body: JSON.stringify({
        account: {
          ...dummyAccount,
          email,
        },
      }),
      sessionData: '',
      headers: {
        'commercetools-frontend-locale': 'en_US',
      },
      path: '',
      method: 'POST',
      query: '',
    };

    const mockAccount: Account = {
      ...dummyAccount,
      email,
      accountId: 'mock-id-789',
      confirmed: true,
      addresses: [],
      confirmationToken: {
        token: 'mock-token',
        email,
      },
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockAccount,
      text: async () => JSON.stringify(mockAccount),
    });

    const response = await register(request, dummyActionContext);
    expect(response.statusCode).toEqual(200);
    const responseBody = JSON.parse(response.body) as Account;
    expect(responseBody).toHaveProperty('accountId');
    expect(responseBody).toHaveProperty('email');
    expect(responseBody).toHaveProperty('firstName');
    expect(responseBody).toHaveProperty('lastName');
    expect(responseBody).toHaveProperty('birthday');
    expect(responseBody).toHaveProperty('confirmed');
    expect(responseBody).toHaveProperty('addresses');
    expect(responseBody.addresses).toBeInstanceOf(Array);
    expect(responseBody).toHaveProperty('confirmationToken');
    expect(responseBody.confirmationToken).toHaveProperty('email');
    expect(responseBody.confirmationToken).toHaveProperty('token');
  });
});
