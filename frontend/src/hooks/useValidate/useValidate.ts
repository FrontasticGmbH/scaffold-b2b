import { useCallback } from 'react';
import { passwordPattern } from '@/constants/regex';

const useValidate = () => {
  const validatePassword = useCallback((password: string) => {
    const passwordRules = new RegExp(passwordPattern);
    return passwordRules.test(password);
  }, []);

  return { validatePassword };
};

export default useValidate;
