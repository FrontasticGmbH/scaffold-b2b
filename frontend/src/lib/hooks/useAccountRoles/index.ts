import useAccount from '../useAccount';
import useBusinessUnits from '../useBusinessUnits';

const useAccountRoles = () => {
  const { account } = useAccount();

  const { defaultBusinessUnit } = useBusinessUnits();

  const role = defaultBusinessUnit?.associates?.find((associate) => associate.accountId === account?.accountId)
    ?.roles?.[0];

  const isAdmin = role?.key === 'admin';

  return { role, isAdmin };
};

export default useAccountRoles;
