import React, { useCallback } from 'react';
import { SlideProps } from '../../types';

const Slide = ({ children, slideWidth, spaceBetween = 10 }: React.PropsWithChildren<SlideProps>) => {
  const getSlideStyles = useCallback<() => React.CSSProperties>(() => {
    const paddingInline = `${Math.floor(spaceBetween / 2)}px`;

    let styles = { paddingInline } as React.CSSProperties;

    if (slideWidth) styles = { ...styles, width: slideWidth };

    return styles;
  }, [spaceBetween, slideWidth]);

  return <div style={getSlideStyles()}>{children}</div>;
};

export default Slide;
