import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RedirectProps } from './types';

const Redirect = ({ to }: RedirectProps) => {
  const { push } = useRouter();

  useEffect(() => {
    if (to) push(to);
  }, [to, push]);

  return <></>;
};

export default Redirect;
