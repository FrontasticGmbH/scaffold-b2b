import React from 'react';
import tastics from '@/lib/tastics';
import { TasticWrapperProps } from './types';
import { highlight } from '../../utils/highlight';
import { deviceVisibility } from '../../utils/device-visibility';
import { injectDataSources } from '../../utils/inject-datasources';
import MissingTastic from '../missing-tastic';

const TasticWrapper = ({
  data,
  params,
  searchParams,
  dataSources,
  isHighlighted,
  projectSettings,
  flatCategories,
  treeCategories,
}: TasticWrapperProps) => {
  const Tastic = tastics[data.tasticType];

  const resolvedTasticData = dataSources ? injectDataSources(data.configuration, dataSources) : data.configuration;

  return (
    <div id={data.tasticId} className={`${highlight(isHighlighted)} ${deviceVisibility(data.configuration)}`}>
      {Tastic ? (
        <Tastic
          data={resolvedTasticData}
          params={params}
          searchParams={searchParams}
          projectSettings={projectSettings}
          flatCategories={flatCategories}
          treeCategories={treeCategories}
        />
      ) : (
        <MissingTastic data={data} />
      )}
    </div>
  );
};

export default TasticWrapper;
