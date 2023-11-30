import { ImageProps as NextImageProps } from 'next/image';
import { Image } from '@/types/image';

export type ImageProps = Omit<NextImageProps, 'src'> & Image;
