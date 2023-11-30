import { HTMLAttributes } from 'react';

export const tagTypesToUse = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'label'] as const;
type ElementType = Pick<React.JSX.IntrinsicElements, (typeof tagTypesToUse)[number]>;

export const fontSizes = [10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 32, 36, 42, 46, 52, 58] as const;
type FontSize = (typeof fontSizes)[number];

export interface TypographyProps extends HTMLAttributes<HTMLHeadingElement | HTMLParagraphElement | HTMLSpanElement> {
  as?: keyof ElementType | 'fragment';
  children?: string;
  className?: HTMLElement['className'];
  lineHeight?: 'tight' | 'normal' | 'loose';
  fontSize?: FontSize;
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  underline?: boolean;
  align?: 'left' | 'center' | 'right';
  asSkeleton?: boolean;
}
