import tastics from '@/lib/tastics';
import { deviceVisibility } from '../../utils/device-visibility';
import { highlight } from '../../utils/highlight';
import { injectDataSources } from '../../utils/inject-datasources';
import MissingTastic from '../missing-tastic';
import { TasticWrapperProps } from './types';

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
    <div
      id={data.tasticId || undefined}
      className={`${highlight(isHighlighted)} ${deviceVisibility(data.configuration)}`}
      suppressHydrationWarning
    >
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
