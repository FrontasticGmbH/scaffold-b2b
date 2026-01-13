import en from './messages/en.json';

// Type for message structure
type Messages = typeof en;

// Augment next-intl with your app config (v4 syntax)
declare module 'next-intl' {
  interface AppConfig {
    Messages: Messages;
    Locale: string;
  }
}
