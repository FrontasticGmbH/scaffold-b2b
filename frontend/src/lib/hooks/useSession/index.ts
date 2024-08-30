import { useEffect, useState } from 'react';
import { Token } from '@shared/types/Token';
import { sdk } from '@/sdk';

const useSession = () => {
  const [session, setSession] = useState<Token>();
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    sdk.composableCommerce.cart.getCheckoutSessionToken({ skipQueue: true }).then((res) => {
      if (!res.isError) setSession(res.data);
      else setIsExpired(true);
    });
  }, []);

  return { session, isExpired };
};

export default useSession;
