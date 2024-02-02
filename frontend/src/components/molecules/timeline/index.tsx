import React from 'react';
import { classnames } from '@/utils/classnames/classnames';
import { TimelineProps } from './types';

const Timeline = ({
  activeIndex: activeIndexProp,
  children,
  classNames = {},
}: React.PropsWithChildren<TimelineProps>) => {
  const length = React.Children.toArray(children).filter(Boolean).length;

  const activeIndex = Math.max(0, Math.min(activeIndexProp ?? 0, length - 1));

  return (
    <div>
      <div className="relative w-full">
        <div className="absolute inset-x-[8px] top-1/2 z-[-1] flex -translate-y-1/2">
          {React.Children.toArray(
            Array.from({ length: length - 1 }).map((_, index) => (
              <div
                className={classnames(
                  'h-[8px] flex-1',
                  index < activeIndex ? classNames.trackActive ?? 'bg-primary' : classNames.track ?? 'bg-gray-300',
                )}
              />
            )),
          )}
        </div>

        <div className="flex justify-between">
          {React.Children.toArray(
            Array.from({ length }).map((_, index, arr) => (
              <div
                className={classnames('flex flex-1', {
                  'justify-start': index === 0,
                  'justify-center': index > 0 && index < arr.length - 1,
                  'justify-end': index === arr.length - 1,
                })}
              >
                <div
                  className={classnames(
                    'h-[16px] w-[16px] rounded-[999px]',
                    index <= activeIndex ? classNames.bulletActive ?? 'bg-primary' : classNames.bullet ?? 'bg-gray-300',
                  )}
                />
              </div>
            )),
          )}
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between">
          {React.Children.toArray(
            React.Children.toArray(children)
              .filter(Boolean)
              .map((Child) => <div className="flex-1">{Child}</div>),
          )}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
