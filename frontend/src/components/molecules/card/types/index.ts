import { ReactElement } from 'react';

export interface CardProps {
  icon: ReactElement<Record<string, any>>;
  title?: string;
  summary?: string;
}
