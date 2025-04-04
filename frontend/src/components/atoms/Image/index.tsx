'use client';

import React from 'react';
import NextImage from 'next/image';
import { CldImage } from 'next-cloudinary';
import { ImageProps } from './types';
import useDimensions from './hooks/useDimensions';
import defaultLoader from './loaders/default';

const Image = ({ media, ratio, gravity, suffix, src = '', width, height, alt = '', ...props }: ImageProps) => {
  const dimensions = useDimensions({ media, width, height, ...props });

  if (!media?.mediaId)
    return (
      <NextImage src={defaultLoader({ src, suffix })} loader={({ src }) => src} alt={alt} {...dimensions} {...props} />
    );

  return (
    <CldImage
      src={media.mediaId}
      alt={alt}
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
