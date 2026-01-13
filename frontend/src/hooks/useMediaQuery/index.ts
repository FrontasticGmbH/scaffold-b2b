'use client';

import { useCallback, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useMediaQueryReturn } from './types';

//custom hook that returns if current screen width is larger than
//the width breakpoint argument or not
const useMediaQuery = <T>(breakpoint?: T) => {
  //current width - default to 1920 (desktop) for SSR to avoid hydration mismatch
  const [width, setWidth] = useState(() => {
    // On client, use cookie or window.innerWidth
    if (typeof window !== 'undefined') {
      return parseInt(Cookies.get('width') ?? String(window.innerWidth));
    }
    // On server, default to desktop width to match most client renders
    return 1920;
  });

  //function to update state with window's screen width
  const updateWidth = useCallback(() => {
    Cookies.set('width', window.innerWidth.toString());
    setWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    // Immediately update width on mount to sync with actual window size
    updateWidth();
    window.addEventListener('resize', updateWidth);
    //cleanup after unmounting

    return () => window.removeEventListener('resize', updateWidth);
  }, [updateWidth]);

  //return a destructible array that includes the boolean and the width also
  return (breakpoint ? [width >= +breakpoint, width] : [width]) as useMediaQueryReturn<T>;
};

export default useMediaQuery;
