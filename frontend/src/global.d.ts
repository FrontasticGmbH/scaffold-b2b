import en from './messages/en.json';

export type Messages = typeof en;

declare global {
  // Use type safe message keys with `next-intl`
  // eslint-disable-next-line
  interface IntlMessages extends Messages {}
}
