'use client';

import dynamic from 'next/dynamic';

const SettingsClientWrapper = dynamic(() => import('./components/settings-client-wrapper'));

const SettingsTastic = () => {
  return <SettingsClientWrapper />;
};

export default SettingsTastic;
