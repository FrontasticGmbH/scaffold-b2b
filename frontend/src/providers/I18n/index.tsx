'use client';

import React, { useContext } from 'react';
import { I18nContextShape } from '@/types/I18n';
import { I18nProviderProps } from './types';

export const I18nContext = React.createContext({} as I18nContextShape);

const I18nProvider = ({ translations, children }: React.PropsWithChildren<I18nProviderProps>) => {
  return <I18nContext.Provider value={{ translations }}>{children}</I18nContext.Provider>;
};

export default I18nProvider;

export const useI18n = () => useContext(I18nContext);
