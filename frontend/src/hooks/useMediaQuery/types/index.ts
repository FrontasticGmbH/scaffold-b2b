export type useMediaQueryReturn<T> = T extends number ? [boolean, number] : [number];
