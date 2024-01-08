import { ForwardedRef, forwardRef } from 'react';
import Slider from '@/components/organisms/slider';
import Arrow from '@/components/organisms/slider/components/arrow';
import { SliderProps } from '@/components/organisms/slider/types';
import Slick from 'react-slick';

const VerticalSlider = ({ children, ...props }: SliderProps, ref: ForwardedRef<Slick | null>) => {
  return (
    <Slider
      vertical
      verticalSwiping
      slidesToShow={4}
      prevArrow={<Arrow position="prev" align="vertical" />}
      nextArrow={<Arrow position="next" align="vertical" />}
      containerClassName="py-6 navigation-slider"
      ref={ref}
      {...props}
    >
      {children}
    </Slider>
  );
};

const VerticalSliderWithRef = forwardRef(VerticalSlider);
export default VerticalSliderWithRef;
