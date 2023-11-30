import { useCallback, useState } from 'react';
import useBusinessUnits from '@/lib/hooks/useBusinessUnits';
import { BusinessUnit } from '@shared/types/business-unit/BusinessUnit';
import useAccount from '@/lib/hooks/useAccount';

const useBusinessUnit = () => {
  const { businessUnits: businessUnitsData } = useBusinessUnits();

  const { account } = useAccount();

  const filterPriviliged = (businessUnit: BusinessUnit) => {
    return businessUnit.associates?.some(
      (associate) =>
        associate.accountId === account?.accountId && associate.roles?.some((role) => role.key === 'admin'),
    );
  };

  const [selectedBusinessUnitKey, setSelectedBusinessUnitKey] = useState<string>();

  const onBusinessUnitSelected = useCallback((key: string) => {
    setSelectedBusinessUnitKey(key);
  }, []);

  const selectedBusinessUnit = businessUnitsData?.find((businessUnit) => businessUnit.key === selectedBusinessUnitKey);

  const activeBusinessUnit = selectedBusinessUnit ?? businessUnitsData?.filter(filterPriviliged)[0];

  const businessUnits = businessUnitsData?.filter(filterPriviliged) ?? [];

  return {
    businessUnits,
    activeBusinessUnit,
    onBusinessUnitSelected,
  };
};

export default useBusinessUnit;
