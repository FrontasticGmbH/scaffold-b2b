'use client';

import React, { useState } from 'react';
import Slick from 'react-slick';
import { classnames } from '@/utils/classnames/classnames';
import useResponsiveValue from '@/hooks/useResponsiveValue';
import { ArrowProps, SliderProps } from './types';
import Slide from './components/slide';
import Arrow from './components/arrow';
import 'slick-carousel/slick/slick.css';
import './styles/index.css';

const Slider = ({
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
  arrowVariant = 'default',
  ...props
}: SliderProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slidesCount = React.Children.count(children);

  const containerClassName = classnames('relative overflow-hidden', { 'px-12': arrows && arrowVariant !== 'overlay' });

  const responsiveSpaceBetween = useResponsiveValue(
    typeof spaceBetween === 'number' ? { base: spaceBetween } : spaceBetween,
  );

  const responsiveSlideWidth = useResponsiveValue(
    typeof slideWidth === 'number' ? { base: slideWidth } : slideWidth ?? {},
  );

  const responsiveSlidesToShow = useResponsiveValue(
    typeof slidesToShow === 'number' ? { base: slidesToShow } : slidesToShow ?? {},
  ) as number;

  const arrowProps = {
    size: arrowSize,
    customClassName: arrowClassName,
  } as ArrowProps;

  return (
    <div className={containerClassName}>
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
          />
        }
        variableWidth={!!slideWidth}
        {...props}
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
