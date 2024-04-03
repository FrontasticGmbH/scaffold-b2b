'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Props } from './types';
import { TasticProps } from '../types';

const BlogClientWrapper = dynamic(() => import('./components/blog-client-wrapper'));

const BlogTastic = (props: TasticProps<Props>) => {
  return <BlogClientWrapper {...props} />;
};

export default BlogTastic;
