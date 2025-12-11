'use client';

import React from 'react';
import Markdown from '@/components/atoms/markdown';
import { TasticProps } from '../types';
import { Props } from './types';

const MarkdownTastic = ({ data }: TasticProps<Props>) => {
  return <Markdown className="p-4 md:px-6 lg:px-12">{data.content}</Markdown>;
};

export default MarkdownTastic;
