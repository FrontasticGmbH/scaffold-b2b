'use client';

import React from 'react';
import NextImage from 'next/image';
import { ImageProps } from './types';
import cloudinaryLoader from './loaders/cloudinary';
import useDimensions from './hooks/useDimensions';
import defaultLoader from './loaders/default';

const Image = ({ media, ratio, gravity, suffix, src = '', width, height, alt = '', ...props }: ImageProps) => {
  const dimensions = useDimensions({ media, width, height, ...props });

  const isStaticImage = src.startsWith('/');

  if (!media?.mediaId)
    return (
      <NextImage
        unoptimized={!isStaticImage}
        src={defaultLoader({ src, suffix })}
        loader={({ src }) => src}
        alt={alt}
        {...dimensions}
        {...props}
      />
    );

  return (
    <NextImage
      src={media.mediaId}
      loader={({ src: mediaId, width }) =>
        cloudinaryLoader({
          mediaId,
          width,
          ratio,
          gravity: gravity?.mode,
          x: gravity?.coordinates?.x.toString(),
          y: gravity?.coordinates?.y.toString(),
        })
      }
      alt={alt}
      {...dimensions}
      {...props}
    />
  );
};

export default Image;
