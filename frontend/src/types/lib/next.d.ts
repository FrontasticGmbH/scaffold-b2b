import 'next/navigation';
import { Params } from '@/types/next';

declare module 'next/navigation' {
  export function useParams(): Params;
}
