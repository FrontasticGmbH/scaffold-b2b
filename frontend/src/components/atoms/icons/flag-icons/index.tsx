import React from 'react';
import dynamic from 'next/dynamic';

const Sweden = dynamic(() => import('./sweden'));
const UnitedStates = dynamic(() => import('./united-states'));

type Props = {
  name: string;
  className?: string;
};

const FlagIcon: React.FC<Props> = ({ className, name }: Props) => {
  const iconClassName = className;
  const flags = {
    sweden: <Sweden />,
    US: <UnitedStates />,
  };
  return <div className={iconClassName}>{flags[name as keyof typeof flags]}</div>;
};

export default FlagIcon;
