import React, { useContext } from 'react';
import Button from '@/components/atoms/button';
import { Bars3CenterLeftIcon } from '@heroicons/react/24/outline';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import Drawer from '../../drawer';
import NavigationSections from '../navigation-drawer/navigation-sections';
import { HeaderContext } from '../context';

const NavigationDrawer = () => {
  const { translate } = useTranslation();
  const { showMenu, showHeaderMenu, hideHeaderMenu } = useContext(HeaderContext);

  return (
    <div className="flex">
      <Button variant="ghost" size="fit" onClick={showHeaderMenu} title={translate('header.menu.open')}>
        <Bars3CenterLeftIcon className="w-8 text-gray-700 lg:w-9" />
      </Button>

      <Drawer
        isOpen={showMenu}
        direction="left"
        className="w-4/5 overflow-y-scroll border border-neutral-400 bg-neutral-100"
        onClose={hideHeaderMenu}
        headline="Shop"
      >
        <NavigationSections />
      </Drawer>
    </div>
  );
};

export default NavigationDrawer;
