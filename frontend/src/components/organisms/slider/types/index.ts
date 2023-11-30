import { ResponsiveQuery } from '@/types/responsive';
import Slick from 'react-slick';

export interface SliderProps extends Omit<React.ComponentProps<typeof Slick>, 'slidesToShow'> {
  spaceBetween?: number | ResponsiveQuery<number>;
  arrowSize?: number;
  arrowStyles?: React.CSSProperties;
  arrowClassName?: string;
  arrowVariant?: ArrowProps['variant'];
  slideWidth?: number | ResponsiveQuery<number>;
  slidesToShow?: number | ResponsiveQuery<number>;
}

export interface SlideProps {
  index: number;
  slidesCount: number;
  slideWidth?: number;
  spaceBetween?: number;
  slidesToShow: number;
  currentSlide: number;
}

export interface ArrowProps {
  className?: string; // Used internally by Slick
  style?: React.CSSProperties; // Used internally by Slick
  onClick?: () => void; // Used internally by Slick
  size?: number;
  customStyles?: React.CSSProperties;
  customClassName?: string;
  position?: 'prev' | 'next';
  variant?: 'default' | 'overlay';
}
