import { useCallback, useState } from 'react';
import useBusinessUnits from '@/lib/hooks/useBusinessUnits';
import { useStoreAndBusinessUnits } from '@/providers/store-and-business-units';

const useBusinessUnit = () => {
  const { businessUnits: businessUnitsData } = useBusinessUnits();

  const { selectedBusinessUnit: globalBusinessUnit } = useStoreAndBusinessUnits();

  const [selectedBusinessUnitKey, setSelectedBusinessUnitKey] = useState<string | undefined>();

  const onBusinessUnitSelected = useCallback((key: string) => {
    setSelectedBusinessUnitKey(key);
  }, []);

  const selectedBusinessUnit = businessUnitsData?.find((businessUnit) => businessUnit.key === selectedBusinessUnitKey);

  const activeBusinessUnit =
    selectedBusinessUnit ??
    businessUnitsData.find((businessUnit) => businessUnit.key === globalBusinessUnit?.key) ??
    businessUnitsData[0];

  const businessUnits = businessUnitsData ?? [];

  return {
    businessUnits,
    activeBusinessUnit,
    onBusinessUnitSelected,
  };
};

export default useBusinessUnit;
