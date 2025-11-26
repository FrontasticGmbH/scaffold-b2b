import { useParams } from 'next/navigation';
import { classnames } from '@/utils/classnames/classnames';
import Breadcrumb from '@/components/molecules/breadcrumb';
import { useTranslations } from 'use-intl';
import Link from '@/components/atoms/link';
import { PDPHeaderProps } from '../types';

const Header = ({ className, product }: PDPHeaderProps) => {
  const translate = useTranslations();
  const { locale } = useParams();

  const headerClassName = classnames('border-b border-neutral-400 pb-4 pt-3 md:pt-4 lg:pt-6', className);

  return (
    <div className={headerClassName}>
      {product?.categories && (
        <Breadcrumb className="pb-3" Separator="|">
          <Link href="/" className="capitalize">
            {translate('common.home')}
          </Link>

          {product.categories.map((category) => (
            <Link key={category.categoryId} href={`${category.paths[locale]}`} className="capitalize">
              {category.name}
            </Link>
          ))}
        </Breadcrumb>
      )}

      <h1 data-testid="product-name" className="text-16 font-bold leading-loose text-gray-700 md:text-18 lg:text-20">
        {product.name}
      </h1>
      <p className="text-14 leading-loose text-gray-600">{product.sku}</p>
    </div>
  );
};

export default Header;
