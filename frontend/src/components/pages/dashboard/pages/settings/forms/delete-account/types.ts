import type { SettingsPageProps } from '../../types';

export interface Props extends Pick<SettingsPageProps, 'onDeleteAccount'> {
  onCancel: () => void;
}
