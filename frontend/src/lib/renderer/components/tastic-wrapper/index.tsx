import React from 'react';
import { TasticWrapperProps } from './types';
import { highlight } from '../../utils/highlight';
import { deviceVisibility } from '../../utils/device-visibility';
import { injectDataSources } from '../../utils/inject-datasources';

const TasticWrapper = ({ tastics, data, searchParams, dataSources, isHighlighted }: TasticWrapperProps) => {
  const Tastic = tastics[data.tasticType];

  if (!Tastic) return <></>;

  const resolvedTasticData = dataSources ? injectDataSources(data.configuration, dataSources) : data.configuration;

  return (
    <div className={`${highlight(isHighlighted)} ${deviceVisibility(data.configuration)}`}>
      <Tastic data={resolvedTasticData} searchParams={searchParams} />
    </div>
  );
};

export default TasticWrapper;
