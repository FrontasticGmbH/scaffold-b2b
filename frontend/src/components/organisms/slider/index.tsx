'use client';

import React, { useState } from 'react';
import Slick from 'react-slick';
import { classnames } from '@/utils/classnames/classnames';
import useResponsiveValue from '@/hooks/useResponsiveValue';
import Slide from './components/slide';
import 'slick-carousel/slick/slick.css';
import './styles/index.css';
import { ArrowProps, SliderProps } from './types';
import Arrow from './components/arrow';

const Slider = ({
  ref,
  children,
  slideWidth,
  slidesToShow = 1,
  infinite = false,
  swipeToSlide = true,
  spaceBetween = 10,
  arrows = true,
  arrowSize = 32,
  arrowStyles = {},
  arrowClassName = '',
  arrowIconClassName = '',
  arrowVariant = 'default',
  overlayDarkArrow = false,
  containerClassName = '',
  ...props
}: SliderProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slidesCount = React.Children.count(children);

  const containerClassNames = classnames({ relative: arrows }, containerClassName);

  const arrowProps = { size: arrowSize, customClassName: arrowClassName, customStyles: arrowStyles } as ArrowProps;

  const responsiveSpaceBetween = useResponsiveValue(
    typeof spaceBetween === 'number' ? { base: spaceBetween } : spaceBetween,
  );

  const responsiveSlideWidth = useResponsiveValue(
    typeof slideWidth === 'number' ? { base: slideWidth } : (slideWidth ?? {}),
  );

  const responsiveSlidesToShow = useResponsiveValue(
    typeof slidesToShow === 'number' ? { base: slidesToShow } : (slidesToShow ?? {}),
  ) as number;

  return (
    <div className={containerClassNames} suppressHydrationWarning>
      <Slick
        beforeChange={(...args) => setCurrentSlide(args[1])}
        slidesToShow={responsiveSlidesToShow}
        swipeToSlide={swipeToSlide}
        infinite={infinite}
        arrows={arrows}
        prevArrow={
          <Arrow
            position="prev"
            variant={arrowVariant}
            {...arrowProps}
            customStyles={{
              ...arrowStyles,
              ...(responsiveSpaceBetween ? { left: `${Math.floor(responsiveSpaceBetween / 2)}px` } : {}),
            }}
            iconClassName={arrowIconClassName}
            overlayDarkArrow={overlayDarkArrow}
          />
        }
        nextArrow={
          <Arrow
            position="next"
            variant={arrowVariant}
            {...arrowProps}
            customStyles={{
              ...arrowStyles,
              ...(responsiveSpaceBetween ? { right: `${Math.floor(responsiveSpaceBetween / 2)}px` } : {}),
            }}
            iconClassName={arrowIconClassName}
            overlayDarkArrow={overlayDarkArrow}
          />
        }
        variableWidth={!!slideWidth}
        ref={ref}
        {...props}
        className="aria-hidden:[&_.slick-slide]:invisible"
      >
        {React.Children.map(children, (Child, index) => (
          <Slide
            slidesCount={slidesCount}
            index={index}
            spaceBetween={responsiveSpaceBetween}
            slideWidth={responsiveSlideWidth}
            slidesToShow={responsiveSlidesToShow}
            currentSlide={currentSlide}
          >
            {Child}
          </Slide>
        ))}
      </Slick>
    </div>
  );
};

export default Slider;
