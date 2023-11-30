export type VarianceToken = string | (string | null | undefined)[] | Variants;

export interface Variants {
  [key: string]: VarianceToken;
}
