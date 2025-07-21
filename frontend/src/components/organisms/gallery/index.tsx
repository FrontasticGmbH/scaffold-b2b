import { useEffect, useMemo, useRef, useState } from 'react';
import Image from '@/components/atoms/Image';
import Slick from 'react-slick';
import useMediaQuery from '@/hooks/useMediaQuery';
import { desktop, tablet } from '@/constants/screensizes';
import VerticalSlider from '@/components/molecules/vertical-slider';
import { classnames } from '@/utils/classnames/classnames';
import { GalleryProps } from './types';
import Slider from '../slider';
import { SliderProps } from '../slider/types';
import './styles/index.css';

const Gallery = ({ className, images }: GalleryProps) => {
  const [mainSlider, setMainSlider] = useState<Slick>();
  const [navigationSlider, setNavigationSlider] = useState<Slick>();

  const [isTablet] = useMediaQuery(tablet);
  const [isDesktop] = useMediaQuery(desktop);

  const useHorizontalNavigation = useMemo(() => isTablet && !isDesktop, [isDesktop, isTablet]);

  const mainSliderRef = useRef<Slick>(null);
  const navigationSliderRef = useRef<Slick>(null);

  useEffect(() => {
    setMainSlider(mainSliderRef.current ?? undefined);
    setNavigationSlider(navigationSliderRef.current ?? undefined);
  }, [mainSliderRef, navigationSliderRef]);

  const commonSliderProps: SliderProps = {
    spaceBetween: 12,
    slidesToScroll: 1,
    initialSlide: 0,
    swipeToSlide: true,
    focusOnSelect: true,
  };

  const galleryClassName = classnames('w-full overflow-y-hidden', className);

  const verticalSliderClassName = classnames('w-[110px]', {
    'h-[450px] overflow-hidden': isDesktop && images.length <= 4,
  });

  return (
    <div className={galleryClassName}>
      <div className="flex gap-3">
        {isDesktop && (
          <VerticalSlider
            ref={isDesktop ? navigationSliderRef : undefined}
            asNavFor={mainSlider}
            className={verticalSliderClassName}
            {...commonSliderProps}
          >
            {images.map((src) => (
              <Image
                key={src}
                className="mx-auto mb-3 size-[100px] cursor-pointer rounded-md object-contain p-1"
                alt=""
                src={src}
                suffix="small"
              />
            ))}
          </VerticalSlider>
        )}

        <Slider
          ref={mainSliderRef}
          asNavFor={navigationSlider}
          containerClassName="w-full overflow-hidden h-fit"
          slidesToShow={1}
          dots={!isTablet}
          {...commonSliderProps}
        >
          {images.map((src, index) => (
            <Image
              key={src}
              className="h-[486px] w-full object-contain"
              alt=""
              src={src}
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          ))}
        </Slider>
      </div>

      {useHorizontalNavigation && (
        <Slider
          ref={useHorizontalNavigation ? navigationSliderRef : undefined}
          asNavFor={mainSlider}
          slideWidth={83}
          slidesToShow={3}
          spaceBetween={12}
          arrowSize={24}
          containerClassName="mt-3 px-7 navigation-slider"
          {...commonSliderProps}
        >
          {images.map((src, index) => (
            <Image
              key={src}
              className="size-[73px] rounded-md object-contain p-1"
              alt=""
              src={src}
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          ))}
        </Slider>
      )}
    </div>
  );
};

export default Gallery;
