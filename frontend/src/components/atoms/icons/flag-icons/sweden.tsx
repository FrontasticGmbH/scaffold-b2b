import React from 'react';

export interface Props {
  className?: string;
}

const SwedenFlag = ({ className }: Props) => {
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="img"
      preserveAspectRatio="xMidYMid meet"
      className={className}
    >
      <g fill="#428bc1">
        <path d="M61.2 25C58 11.8 46.2 2 32 2h-1v23h30.2" />
        <path d="M17 6C10 10.1 4.8 16.9 2.8 25H17V6z" />
        <path d="M2.8 39c2 8.1 7.2 14.9 14.2 19V39H2.8z" />
        <path d="M31 62h1c14.2 0 26-9.8 29.2-23H31v23" />
      </g>

      <path
        d="M61.2 25H31V2c-5.1.2-9.9 1.6-14 4v19H2.8c-.5 2.2-.8 4.6-.8 7c0 2.4.3 4.8.8 7H17v19c4.1 2.4 8.9 3.8 14 4V39h30.2c.5-2.2.8-4.6.8-7c0-2.4-.3-4.8-.8-7"
        fill="#ffe62e"
      />
    </svg>
  );
};

export default SwedenFlag;
