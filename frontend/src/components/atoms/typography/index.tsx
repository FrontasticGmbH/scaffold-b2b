'use client';

import React, { createElement, Fragment } from 'react';
import { classnames } from '@/utils/classnames/classnames';
import Skeleton from '../skeleton';
import { TypographyProps } from './types';
import { alignment, fontSizes, fontWeights, lineHeights } from './helpers/variants';

const Typography: React.FC<TypographyProps> = ({
  children,
  as = 'p',
  asSkeleton = false,
  fontSize = 16,
  align,
  lineHeight = 'normal',
  fontWeight = 'normal',
  underline = false,
  className,
  ...props
}) => {
  const elementClassName = classnames(
    fontSizes(fontSize.toString()) as string,
    lineHeights(lineHeight) as string,
    fontWeights(fontWeight) as string,
    { underline },
    { relative: asSkeleton },
    { [alignment(align ?? '') as string]: !!align },
    className,
  );

  // Constructing default props of the element
  const elementProps: React.HTMLAttributes<HTMLElement> & React.Attributes = {
    className: elementClassName,
    ...props,
  };

  const TypographyElement = createElement(
    as === 'fragment' ? Fragment : as,
    as !== 'fragment' ? elementProps : undefined,
    <>
      {asSkeleton && <Skeleton fillMode />}
      {children}
    </>,
  );

  return TypographyElement;
};

export default Typography;
