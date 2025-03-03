import Slider from '@/components/organisms/slider';
import Arrow from '@/components/organisms/slider/components/arrow';
import { SliderProps } from '@/components/organisms/slider/types';

const VerticalSlider = ({ ref, children, ...props }: SliderProps) => {
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

export default VerticalSlider;
