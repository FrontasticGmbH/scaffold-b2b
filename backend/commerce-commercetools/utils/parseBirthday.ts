import { AccountRegisterBody } from '../actionControllers/AccountController';

export function parseBirthday(accountRegisterBody: AccountRegisterBody): Date | undefined {
  if (accountRegisterBody.birthdayYear) {
    return new Date(
      +accountRegisterBody.birthdayYear,
      +(accountRegisterBody?.birthdayMonth ?? 1),
      +(accountRegisterBody?.birthdayDay ?? 1),
    );
  }

  return undefined;
}
