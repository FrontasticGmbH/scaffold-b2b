import React from 'react';
import Link from '@/components/atoms/link';
import Image from '@/components/atoms/Image';
import { Image as LogoImage } from '@/types/image';
import { Link as LogoLink } from '@/types/link';
export interface Props {
  logo: LogoImage;
  logoLink: LogoLink;
  imageClassName?: string;
  onClick?: () => void;
}

const HeaderLogo = ({ logoLink, logo, imageClassName, onClick }: Props) => {
  return (
    <div onClick={onClick}>
      <Link className={imageClassName} href={logoLink.href ?? '/'}>
        <Image
          media={logo.media ?? {}}
          src={logo.src ?? ''}
          width={logo.width}
          height={logo.height}
          alt={logo?.media?.name ?? 'Logo'}
        />
      </Link>
    </div>
  );
};

export default HeaderLogo;
