import React, { useCallback } from 'react';
import { CardProps } from './types';

const Card = ({ icon, title, summary }: CardProps) => {
  const renderIcon = useCallback(() => {
    if (!React.isValidElement(icon)) return icon;

    return React.cloneElement(icon, { ...icon.props, className: `${icon.props.className ?? ''} w-full h-full` });
  }, [icon]);

  return (
    <div className="flex w-full items-center gap-4 rounded-md border border-neutral-400 px-5 py-6 md:gap-5">
      <div className="box-content rounded-full bg-neutral-300 p-5">
        <span className="block h-[20px] w-[20px] text-primary md:h-[24px] md:w-[24px] lg:h-[28px] lg:w-[28px]">
          {renderIcon()}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <h5 className="text-14 font-semibold leading-normal text-gray-700">{title}</h5>
        <p className="text-14 leading-loose text-gray-600">{summary}</p>
      </div>
    </div>
  );
};

export default Card;
