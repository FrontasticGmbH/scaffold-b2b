import useRoles from '@/lib/hooks/useRoles';

const useRole = () => {
  const { data: rolesData } = useRoles();

  const roleOptions = rolesData.map(({ name, key }) => ({ name: name ?? '', value: key ?? '' }));

  return { roleOptions };
};

export default useRole;
