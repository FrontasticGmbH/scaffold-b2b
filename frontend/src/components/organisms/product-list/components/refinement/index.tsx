import React from 'react';
import { XMarkIcon as RemoveIcon } from '@heroicons/react/24/outline';
import { Props } from './types';

const Refinement = ({ name, onRemove }: Props) => {
  return (
    <div className="flex cursor-default items-center gap-2 rounded-md bg-neutral-200 p-2">
      <span className="text-14 text-gray-700">{name}</span>
      <RemoveIcon className="cursor-pointer text-gray-700" width={16} onClick={onRemove} />
    </div>
  );
};

export default Refinement;
