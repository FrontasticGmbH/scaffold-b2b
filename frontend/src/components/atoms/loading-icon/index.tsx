'use client';

import { LoadingIconProps } from './types';

const LoadingIcon = ({ svgWidth, svgHeight, className = 'fill-white' }: LoadingIconProps) => {
  const spinningSectorClassName = `absolute right-0 top-0 flex animate-spin justify-end`;

  return (
    <div data-testid="loading-svg" className="relative" style={{ width: svgWidth, height: svgHeight }}>
      <svg xmlns="http://www.w3.org/2000/svg" width={svgWidth} height={svgWidth} viewBox="0 0 20 20" fill="none">
        <path
          className={className}
          opacity="0.5"
          d="M10 0C8.02219 0 6.08879 0.58649 4.4443 1.6853C2.79981 2.78412 1.51809 4.3459 0.761209 6.17317C0.00433284 8.00043 -0.193701 10.0111 0.192152 11.9509C0.578004 13.8907 1.53041 15.6725 2.92894 17.0711C4.32746 18.4696 6.10929 19.422 8.0491 19.8079C9.98891 20.1937 11.9996 19.9957 13.8268 19.2388C15.6541 18.4819 17.2159 17.2002 18.3147 15.5557C19.4135 13.9112 20 11.9778 20 10C20 8.68678 19.7413 7.38642 19.2388 6.17317C18.7363 4.95991 17.9997 3.85752 17.0711 2.92893C16.1425 2.00035 15.0401 1.26375 13.8268 0.761205C12.6136 0.258658 11.3132 0 10 0V0ZM10 18C8.41775 18 6.87104 17.5308 5.55544 16.6518C4.23985 15.7727 3.21447 14.5233 2.60897 13.0615C2.00347 11.5997 1.84504 9.99113 2.15372 8.43928C2.4624 6.88743 3.22433 5.46197 4.34315 4.34315C5.46197 3.22433 6.88743 2.4624 8.43928 2.15372C9.99113 1.84504 11.5997 2.00346 13.0615 2.60896C14.5233 3.21447 15.7727 4.23984 16.6518 5.55544C17.5308 6.87103 18 8.41775 18 10C18 12.1217 17.1572 14.1566 15.6569 15.6569C14.1566 17.1571 12.1217 18 10 18V18Z"
        />
      </svg>
      <span className={spinningSectorClassName} style={{ width: svgWidth, height: svgHeight }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={svgWidth / 2}
          height={svgHeight / 2}
          viewBox="0 0 10 10"
          fill="none"
        >
          <path
            className={className}
            d="M8 10H10C10 8.68678 9.74134 7.38642 9.2388 6.17317C8.73625 4.95991 7.99965 3.85752 7.07107 2.92893C6.14248 2.00035 5.04009 1.26375 3.82683 0.761205C2.61358 0.258658 1.31322 0 0 0V2C2.12173 2 4.15656 2.84285 5.65685 4.34315C7.15715 5.84344 8 7.87827 8 10Z"
          />
        </svg>
      </span>
    </div>
  );
};

export default LoadingIcon;
