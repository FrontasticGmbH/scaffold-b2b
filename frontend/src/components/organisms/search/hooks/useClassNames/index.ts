import { cva } from '@/utils/classnames/cva';
import { classnames } from '@/utils/classnames/classnames';
import { SearchVariant } from '@/components/atoms/search-input/types';
import useMediaQuery from '@/hooks/useMediaQuery';
import { tablet } from '@/constants/screensizes';

const useClassNames = (variant: SearchVariant, focused: boolean) => {
  const [isLargerThanTablet] = useMediaQuery(tablet);
  const resolveSearchWrapper = cva({
    xs: 'rounded-md',
    sm: 'rounded-md',
    lg: classnames('px-4 py-2 md:py-3 lg:p-3', focused ? 'rounded-t-md' : 'rounded-sm'),
  });
  const resolveSearchPanel = cva({
    xs: 'top-[48px] max-h-[200px] rounded-md py-2 shadow-500',
    sm: 'top-[52px] max-h-[288px] rounded-md shadow-500',
    lg: 'top-[60px] max-h-full rounded-b-md py-2 md:mt-0 md:max-h-[404px] lg:top-[66px] lg:max-h-[460px]',
  });

  const SearchWrapperClassNames = classnames(
    focused && !isLargerThanTablet && variant === 'lg'
      ? 'absolute left-0 top-0 z-[450] h-[100vh] w-full px-4 pb-3 pt-4'
      : 'relative z-[340]',
    'bg-white',
    resolveSearchWrapper(variant) as string,
  );

  const searchPanelClassNames = classnames(
    'absolute left-0 z-[340] w-full overflow-y-auto bg-white',
    resolveSearchPanel(variant) as string,
  );

  return {
    SearchWrapperClassNames,
    searchPanelClassNames,
  };
};

export default useClassNames;
