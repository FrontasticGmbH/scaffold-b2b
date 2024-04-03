import React from 'react';
import { classnames } from '@/utils/classnames/classnames';

type Props = {
  name: string;
  className?: string;
};

const FlagIcon: React.FC<Props> = ({ className, name }: Props) => {
  return (
    <span
      //eslint-disable-next-line tailwindcss/no-custom-classname
      className={classnames(className, 'fi', `fi-${name}`, 'block')}
      style={{ width: 20, height: 20, backgroundSize: 'cover' }}
    />
  );
};

export default FlagIcon;
