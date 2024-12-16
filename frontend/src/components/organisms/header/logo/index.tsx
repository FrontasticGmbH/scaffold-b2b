import React from 'react';
import Link from '@/components/atoms/link';
import Image from '@/components/atoms/Image';
import { Image as LogoImage } from '@/types/image';
import { Link as LogoLink } from '@/types/link';
import useImageSizes from '@/hooks/useImageSizes';
export interface Props {
  logo: LogoImage;
  logoLink: LogoLink;
  imageClassName?: string;
  onClick?: () => void;
}

const HeaderLogo = ({ logoLink, logo, imageClassName, onClick }: Props) => {
  const logoImageSizes = useImageSizes({ sm: 0.75, md: 0.5, lg: 0.25, defaultSize: 0.15 });

  return (
    <div onClick={onClick}>
      <Link className={imageClassName} href={logoLink.href ?? '/'}>
        <Image
          media={logo.media ?? {}}
          src={logo.src ?? ''}
          width={logo.width}
          height={logo.height}
          alt={logo?.media?.name ?? 'Logo'}
          sizes={logoImageSizes}
        />
      </Link>
    </div>
  );
};

export default HeaderLogo;
