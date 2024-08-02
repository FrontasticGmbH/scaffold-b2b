import { cva } from '@/utils/classnames/cva';
import { classnames } from '@/utils/classnames/classnames';
import { DrawerTransitions, DrawerVariant } from '../../types';

const useClassNames = (variant: DrawerVariant) => {
  const resolveVariant = cva({
    left: {
      position: 'left-0 top-0',
      transition: {
        enterFrom: '-translate-x-full transform opacity-0',
        enterTo: 'translate-x-0 opacity-100 transition',
        leaveFrom: 'translate-x-0 opacity-100 transition',
        leaveTo: '-translate-x-full opacity-0 transition',
      },
    },
    right: {
      position: 'right-0 top-0',
      transition: {
        enterFrom: 'translate-x-full transform opacity-0',
        enterTo: '-translate-x-0 opacity-100 transition',
        leaveFrom: '-translate-x-0 opacity-100 transition',
        leaveTo: 'translate-x-full opacity-0 transition',
      },
    },
  });

  const drawerClassName = classnames(
    'fixed z-[999] h-screen shadow-lg',
    resolveVariant(`${variant}.position`) as string,
  );

  const drawerTransition: DrawerTransitions = {
    enterFrom: resolveVariant(`${variant}.transition.enterFrom`) as string,
    enterTo: resolveVariant(`${variant}.transition.enterTo`) as string,
    leaveFrom: resolveVariant(`${variant}.transition.leaveFrom`) as string,
    leaveTo: resolveVariant(`${variant}.transition.leaveTo`) as string,
  };

  return { drawerClassName, drawerTransition };
};

export default useClassNames;
