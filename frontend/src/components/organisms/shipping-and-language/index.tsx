import React from 'react';
import { ShipAndLanguageProps } from './types';
import ShippingAndLanguageSectionMobile from './ship-and-language-mobile';
import ShipAndLanguageSectionDesktop from './ship-and-language-desktop';

const ShippingAndLanguageSection = ({ desktopDirection }: ShipAndLanguageProps) => {
  return (
    <>
      <div className="block pb-4 lg:hidden">
        <ShippingAndLanguageSectionMobile />
      </div>
      <div className="hidden lg:block">
        <ShipAndLanguageSectionDesktop direction={desktopDirection ?? 'left'} />
      </div>
    </>
  );
};

export default ShippingAndLanguageSection;
