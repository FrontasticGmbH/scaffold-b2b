'use client';

import React from 'react';
import HeroTile from '@/components/organisms/hero-tile';
import { resolveReference } from '@/utils/lib/resolve-reference';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import useAccount from '@/lib/hooks/useAccount';
import { TasticProps } from '../types';
import { Props } from './types';

const HeroTileTastic = ({ data: { links, ...data } }: TasticProps<Props>) => {
  const { translate } = useTranslation();

  const { account } = useAccount();

  return (
    <HeroTile
      {...data}
      title={translate('common.say.hi', { values: { name: account?.firstName ?? translate('common.user') } })}
      links={links.map((link) => resolveReference(link.href, link.name))}
    />
  );
};

export default HeroTileTastic;
