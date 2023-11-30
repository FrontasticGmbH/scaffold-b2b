import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { SettingsPageProps } from '@/components/pages/dashboard/pages/settings/types';
import PersonalInfoForm from '@/components/pages/dashboard/pages/settings/forms/personal-info';

const useSubPath = (props: SettingsPageProps) => {
  const searchParams = useSearchParams();

  const subPath = searchParams.get('subPath');

  const ActiveSubPath = useMemo(() => {
    const components = {
      'edit-personal-info': {
        title: 'dashboard.personal.info.edit',
        Component: <PersonalInfoForm {...props} />,
      },
    };

    if (!subPath || !Object.keys(components).includes(subPath)) return;

    return components[subPath as keyof typeof components];
  }, [subPath, props]);

  return { subPath, ActiveSubPath };
};

export default useSubPath;
