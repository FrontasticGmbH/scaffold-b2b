import React from 'react';
import Breadcrumb from '@/components/molecules/breadcrumb';
import Link from '@/components/atoms/link';
import { ProductListProps } from '../../types';

const CategoriesBreadcrumb = ({ breadcrumb }: ProductListProps) => {
  return (
    <Breadcrumb Separator="|">
      {breadcrumb.map(({ name, link }) => (
        <Link key={name} href={link} className="capitalize">
          {name}
        </Link>
      ))}
    </Breadcrumb>
  );
};

export default CategoriesBreadcrumb;
