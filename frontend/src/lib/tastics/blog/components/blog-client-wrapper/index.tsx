import React from 'react';
import Blog from '@/components/molecules/blog';
import { resolveReference } from '@/utils/lib/resolve-reference';
import { TasticProps } from '@/lib/tastics/types';
import { Props } from '../../types';

const BlogClientWrapper = ({ data: { link, linkName, ...data } }: TasticProps<Props>) => {
  return (
    <div className="mx-auto max-w-[680px] p-4 md:p-6">
      <Blog {...data} link={resolveReference(link, linkName)} />
    </div>
  );
};

export default BlogClientWrapper;
