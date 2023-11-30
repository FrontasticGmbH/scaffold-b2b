'use client';

import React from 'react';
import NextImage from 'next/image';
import { ImageProps } from './types';
import useParameterizedSrc from './hooks/useParameterizedSrc';
import cloudinaryLoader from './loaders/cloudinary';
import useDimensions from './hooks/useDimensions';

const Image = ({ media, ratio, gravity, suffix, src, width, height, alt = '', ...props }: ImageProps) => {
  const parameterizedSrc = useParameterizedSrc({ ratio, gravity, suffix, media });

  const dimensions = useDimensions({ media, width, height, ...props });

  if (!media?.mediaId)
    return <NextImage unoptimized src={src ?? ''} loader={({ src }) => src} alt={alt} {...dimensions} {...props} />;

  return <NextImage src={parameterizedSrc} loader={cloudinaryLoader} alt={alt} {...dimensions} {...props} />;
};

export default Image;
