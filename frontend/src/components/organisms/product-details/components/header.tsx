import Typography from '@/components/atoms/typography';
import { classnames } from '@/utils/classnames/classnames';
import Breadcrumb from '@/components/molecules/breadcrumb';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import Link from '@/components/atoms/link';
import { PDPHeaderProps } from '../types';

const Header = ({ className, product }: PDPHeaderProps) => {
  const { translate } = useTranslation();

  const headerClassName = classnames('border-b border-neutral-400 pb-4 pt-3 md:pt-4 lg:pt-6', className);

  return (
    <div className={headerClassName}>
      {product?.categories && (
        <Breadcrumb className="pb-3" Separator="|">
          <Link href="/" className="capitalize">
            {translate('common.home')}
          </Link>

          {product.categories.map((category) => (
            <Link key={category.categoryId} href={`/${category.path}`} className="capitalize">
              {category.name}
            </Link>
          ))}
        </Breadcrumb>
      )}

      <Typography className="text-gray-700 md:text-18 lg:text-20" fontSize={16} lineHeight="loose" fontWeight="bold">
        {product.name}
      </Typography>
      <Typography className="text-gray-600" fontSize={14} lineHeight="loose">
        {product.sku}
      </Typography>
    </div>
  );
};

export default Header;
