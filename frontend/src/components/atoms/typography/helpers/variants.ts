import { cva } from '@/utils/classnames/cva';

export const fontSizes = cva({
  10: 'text-10',
  11: 'text-11',
  12: 'text-12',
  14: 'text-14',
  16: 'text-16',
  18: 'text-18',
  20: 'text-20',
  22: 'text-22',
  24: 'text-24',
  26: 'text-26',
  28: 'text-28',
  32: 'text-32',
  36: 'text-36',
  42: 'text-42',
  46: 'text-46',
  52: 'text-52',
  58: 'text-58',
});

export const fontWeights = cva({
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
});

export const alignment = cva({
  left: 'text-left',
  right: 'text-right',
  center: 'text-center',
});

export const lineHeights = cva({
  tight: 'leading-tight',
  normal: 'leading-normal',
  loose: 'leading-loose',
});
