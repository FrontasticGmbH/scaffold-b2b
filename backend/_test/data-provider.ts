import { Request } from '@frontastic/extension-types';
import { register } from '../commerce-commercetools/actionControllers/AccountController';

const dummyActionContext = {
  frontasticContext: {
    environment: 'dev',
    project: {
      customer: 'demo',
      projectId: 'swiss',
      name: 'Swiss Catwalk',
      configuration: {
        commercetools: {
          // <--- Add configuration for a B2B Project ⤵️
          authUrl: 'ADD REAL VALUE',
          hostUrl: 'ADD REAL VALUE',
          clientId: 'ADD REAL VALUE',
          clientSecret: 'ADD REAL VALUE',
          projectKey: 'ADD REAL VALUE',
          productIdField: 'ADD REAL VALUE',
          categoryIdField: 'ADD REAL VALUE',
        },
        associateRoles: {
          defaultAdminRoleKey: 'buyer',
          defaultBuyerRoleKey: 'buyer',
          defaultSuperUserRoleKey: 'superuser',
        },
        smtp: {
          host: 'ADD REAL VALUE',
          port: 'ADD REAL VALUE',
          encryption: 'ADD REAL VALUE',
          user: 'ADD REAL VALUE',
          password: 'ADD REAL VALUE',
          sender: 'ADD REAL VALUE',
          client_host: 'ADD REAL VALUE',
        },
      },
      locales: ['en_US', 'en_GB'],
      defaultLocale: 'en_GB',
    },
    projectConfiguration: {},
    locale: 'en_GB',
    featureFlags: {},
  },
};
const dummyAccount = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'test-account@commercetools.com',
  password: '1234',
  birthdayYear: '2001',
  birthdayMonth: '01',
  birthdayDay: '26',
};

const frontasticSession =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY2NvdW50Ijp7ImFjY291bnRJZCI6IjlkOWZlMTQ1LTA0M2UtNDhhNi1iODA2LTZiYTg0ZWRlY2U5YiIsImVtYWlsIjoiY2FybG9zLm1vdXJ1bGxvKzEyM0Bjb21tZXJjZXRvb2xzLmNvbSIsImZpcnN0TmFtZSI6IkNlbGluZSIsImxhc3ROYW1lIjoiQmVja2VyIiwiYmlydGhkYXkiOiIyMDAxLTAxLTI2VDAwOjAwOjAwLjAwMFoiLCJjb25maXJtZWQiOnRydWUsImFkZHJlc3NlcyI6W3siYWRkcmVzc0lkIjoibU5ySWxBbGYiLCJmaXJzdE5hbWUiOiJBeWRlbiIsImxhc3ROYW1lIjoiSGVsbGVyIiwic3RyZWV0TmFtZSI6IkFudG9uaW8gSXNsZSIsInN0cmVldE51bWJlciI6IjUwNCIsInBvc3RhbENvZGUiOiIxNDYiLCJjaXR5IjoiRGF2aWUiLCJjb3VudHJ5IjoiU1MiLCJwaG9uZSI6Ijc4My02NzktNTQ5MSIsImlzRGVmYXVsdEJpbGxpbmdBZGRyZXNzIjp0cnVlLCJpc0RlZmF1bHRTaGlwcGluZ0FkZHJlc3MiOnRydWV9XX19.VKO7laTyKomyyLP95pSlIMKRTh9K_4r4ALf1cJ8jpg4';

const generateFakeEmailAddress = () => {
  const username = Math.random().toString(36).substring(2, 10);
  return `${username}@test.com`;
};

const createFakeUser = async (): Promise<string> => {
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
      'frontastic-locale': 'en_GB',
    },
    path: '',
    method: 'POST',
    query: '',
  };
  const response = await register(request, dummyActionContext);
  if (response.statusCode === 200) {
    return email;
  } else {
    return '';
  }
};

export { dummyActionContext, dummyAccount, frontasticSession, generateFakeEmailAddress, createFakeUser };
