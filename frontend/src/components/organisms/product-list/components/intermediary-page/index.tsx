import React from 'react';
import Link from '@/components/atoms/link';
import Image from '@/components/atoms/Image';
import Button from '@/components/atoms/button';
import useFormat from '@/hooks/useFormat';
import { ChevronRightIcon as ArrowIcon } from '@heroicons/react/24/outline';
import { classnames } from '@/utils/classnames/classnames';
import { Props } from './props';
import CategoriesBreadcrumb from '../breadcrumb';

const IntermediaryProductList = ({ title, link, breadcrumb, items, highlight }: Props) => {
  const { formatCurrency } = useFormat();

  return (
    <>
      <div className="bg-neutral-200 px-4 py-5 md:px-6 md:pb-8 lg:px-12 lg:pb-12">
        <div className="hidden pb-4 lg:block">
          <CategoriesBreadcrumb breadcrumb={breadcrumb} />
        </div>
        <h2 className="text-18 font-bold leading-normal text-gray-800 md:text-20 lg:text-24">{title}</h2>
        <Link
          chevron
          className="mt-4 block text-14 capitalize text-primary md:text-16"
          href={link.href ?? '#'}
          openInNewTab={link.openInNewTab}
        >
          {link.name}
        </Link>
        <div className="mt-6 grid grid-cols-2 gap-3 md:mt-7 md:grid-cols-3 md:gap-4 lg:mt-9 lg:grid-cols-4 lg:gap-5">
          {items.map(({ name, image, url }) => (
            <Link
              key={name}
              href={url ?? '#'}
              className="flex w-full flex-col items-center gap-3 rounded-lg bg-white px-3 py-5 lg:pb-10 lg:pt-7"
              underlineOnHover={false}
            >
              <div className="relative w-1/2 pb-[50%]">
                <Image {...(image ?? {})} alt={name ?? '#'} fill style={{ objectFit: 'contain' }} />
              </div>
              <span className="text-center text-12 font-medium text-gray-700 md:text-16">{name}</span>
            </Link>
          ))}
        </div>
      </div>
      <div className="bg-white px-4 py-5 md:px-6 md:py-8 lg:p-12">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h3 className="font-bold leading-loose text-gray-700 md:text-18 lg:text-20">{highlight.headline}</h3>
            <p className="mt-3 text-14 leading-loose text-gray-600 md:text-14">{highlight.subline}</p>
          </div>
          <Link href={highlight.cta.href ?? '#'} openInNewTab={highlight.cta.openInNewTab}>
            <Button size="s" className="lg:py-3 lg:text-14" variant="secondary">
              {highlight.cta.name}
            </Button>
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-3 lg:gap-5">
          {highlight.items.map(({ name, price, url, currency, image, pressTargetPosition }) => (
            <div className="relative pb-[105%] lg:pb-[85%]" key={name}>
              <Image {...image} fill style={{ objectFit: 'cover' }} className="rounded-md" alt={name} />
              <Link
                href={url ?? '#'}
                className={classnames(
                  'absolute left-4 flex max-w-[90%] items-start justify-between gap-1 rounded-sm bg-white p-4 md:max-w-[70%] lg:left-6 xl:max-w-[45%]',
                  { 'bottom-4 lg:bottom-6': pressTargetPosition === 'bottom' },
                  { 'top-4 lg:top-6': pressTargetPosition === 'top' },
                )}
              >
                <div>
                  <span className="block font-normal leading-loose lg:text-18">{name}</span>
                  <span className="mt-3 block text-14 font-medium text-gray-700 lg:text-16">
                    {formatCurrency(price, currency)}
                  </span>
                </div>
                <ArrowIcon width={24} height={24} className="mt-[2px] shrink-0 text-gray-700" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default IntermediaryProductList;
