import 'next/navigation';
import { Params } from '@/types/next';

declare module 'next/navigation' {
  export function useParams<T extends Record<string, unknown> = Record<string, unknown>>(): Params<T>;
}
