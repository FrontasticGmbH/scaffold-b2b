import type { SettingsPageProps } from '../../types';

export interface Props extends Pick<SettingsPageProps, 'onUpdateNewsletterPreferences'> {
  onCancel: () => void;
}
