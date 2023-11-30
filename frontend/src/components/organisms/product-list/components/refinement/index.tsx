import React from 'react';
import { XMarkIcon as RemoveIcon } from '@heroicons/react/24/outline';
import { Props } from './types';

const Refinement = ({ name, onRemove }: Props) => {
  return (
    <div className="flex h-[32px] cursor-default items-center justify-center gap-2 rounded-md bg-neutral-200 px-2">
      <span className="text-14 leading-[20px] text-gray-700">{name}</span>
      <RemoveIcon className="cursor-pointer text-gray-700" width={16} onClick={onRemove} />
    </div>
  );
};

export default Refinement;
