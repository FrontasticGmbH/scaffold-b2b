import React, { useState } from 'react';
import { classnames } from '@/utils/classnames/classnames';
import Dropdown from '../dropdown';
import { RefinementDropdownProps } from './types';
import Checkbox from '../checkbox';

const RefinementDropdown = ({ options, children, ...props }: React.PropsWithChildren<RefinementDropdownProps>) => {
  const [hovered, setHovered] = useState<Record<string, boolean>>({});

  return (
    <Dropdown {...props}>
      <Dropdown.Button>{children}</Dropdown.Button>
      <Dropdown.Options className="min-w-fit">
        {options.map(({ name, value, count, selected, onSelected }) => (
          <div
            key={value}
            onMouseEnter={() => setHovered((hovered) => ({ ...hovered, [value]: true }))}
            onMouseLeave={() => setHovered((hovered) => ({ ...hovered, [value]: false }))}
            onClick={() => onSelected?.(!selected)}
            className="py-1"
          >
            <Dropdown.Option value={value}>
              <div className="flex items-center justify-between gap-8">
                <span className="text-14 text-gray-700">{name}</span>
                <div className="flex items-center gap-2">
                  {count !== undefined && <span className="text-12 text-gray-600">{count}</span>}
                  <Checkbox checked={selected} className={classnames({ 'border-gray-800': hovered[value] })} />
                </div>
              </div>
            </Dropdown.Option>
          </div>
        ))}
      </Dropdown.Options>
    </Dropdown>
  );
};

export default RefinementDropdown;
