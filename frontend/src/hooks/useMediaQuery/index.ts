'use client';

import { useCallback, useEffect, useState } from 'react';
import { useCookies } from 'next-client-cookies';
import { useMediaQueryReturn } from './types';

//custom hook that returns if current screen width is larger than
//the width breakpoint argument or not
const useMediaQuery = <T>(breakpoint?: T) => {
  //current width
  const cookies = useCookies();
  const [width, setWidth] = useState(parseInt(cookies.get('width') ?? '0'));

  //function to update state with window's screen width
  const updateWidth = useCallback(() => {
    cookies.set('width', window.innerWidth.toString());
    setWidth(window.innerWidth);
  }, [cookies]);

  useEffect(() => {
    updateWidth();
    window.addEventListener('resize', updateWidth);
    //cleanup after unmounting

    return () => window.removeEventListener('resize', updateWidth);
  }, [updateWidth]);

  //return a destructible array that includes the boolean and the width also
  return (breakpoint ? [width >= +breakpoint, width] : [width]) as useMediaQueryReturn<T>;
};

export default useMediaQuery;
