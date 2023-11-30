'use client';

import { useState, useEffect, useCallback } from 'react';
import { useMediaQueryReturn } from './types';

//custom hook that returns if current screen width is larger than
//the width breakpoint argument or not
const useMediaQuery = <T>(breakpoint?: T) => {
  //current width
  const [width, setWidth] = useState(window.innerWidth);

  //function to update state with window's screen width
  const updateWidth = useCallback(() => setWidth(window.innerWidth), []);

  useEffect(() => {
    window.addEventListener('resize', updateWidth);

    //cleanup after unmounting
    return () => window.removeEventListener('resize', updateWidth);
  }, [updateWidth]);

  //return a destructible array that includes the boolean and the width also
  return (breakpoint ? [width >= +breakpoint, width] : [width]) as useMediaQueryReturn<T>;
};

export default useMediaQuery;
