'use client';

import React from 'react';
import NextImage from 'next/image';
import { CldImage } from 'next-cloudinary';
import { ImageProps } from './types';
import useDimensions from './hooks/useDimensions';
import defaultLoader from './loaders/default';
import { useLocale } from 'next-intl';
import { getLocalizationInfo } from '@/project.config';

const Image = ({ media, ratio, gravity, suffix, src = '', width, height, title, alt = '', ...props }: ImageProps) => {
  const locale = useLocale();

  const dimensions = useDimensions({ media, width, height, ...props });

  if (!media?.mediaId)
    return (
      <NextImage
        src={defaultLoader({ src, suffix })}
        loader={({ src }) => src}
        alt={alt}
        title={title as string}
        {...dimensions}
        {...props}
      />
    );

  const mediaTitle =
    typeof title === 'string'
      ? title
      : (title?.[getLocalizationInfo(locale).locale.replace('-', '_') as keyof typeof title] ??
        Object.values(title ?? {})[0]);

  return (
    <CldImage
      src={media.mediaId}
      alt={mediaTitle || alt}
      title={mediaTitle}
      aspectRatio={ratio}
      gravity={gravity?.mode ?? 'auto'}
      format="auto"
      crop={{ type: 'scale', x: gravity?.coordinates?.x.toString(), y: gravity?.coordinates?.y.toString() }}
      quality="auto"
      {...dimensions}
      {...props}
    />
  );
};

export default Image;
