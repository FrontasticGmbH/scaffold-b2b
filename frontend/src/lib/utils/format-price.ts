import { DiscountSegment } from '@/types/transaction';

/**
 * Converts a centAmount value to a decimal number for display
 *
 * @param centAmount The amount in the smallest currency unit (e.g., cents)
 * @param fractionDigits The number of decimal places for this currency (default: 2)
 * @returns The decimal amount for display (e.g., 12345 cents with fractionDigits 2 = 123.45)
 */
export function formatCentAmount(centAmount: number, fractionDigits: number = 2): number {
  return centAmount / Math.pow(10, fractionDigits);
}

/**
 * Converts a decimal number back to centAmount
 *
 * @param amount The decimal amount
 * @param fractionDigits The number of decimal places for this currency (default: 2)
 * @returns The amount in the smallest currency unit
 */
export function toCentAmount(amount: number, fractionDigits: number = 2): number {
  return Math.round(amount * Math.pow(10, fractionDigits));
}

/**
 * Formats discount segments from centAmounts to display values
 *
 * @param segments Array of discount segments with centAmount values
 * @param fractionDigits The number of decimal places for this currency (default: 2)
 * @returns Formatted discount segments for display
 */
export function formatDiscountSegments(segments: DiscountSegment[], fractionDigits: number = 2): DiscountSegment[] {
  return segments.map((segment) => ({
    ...segment,
    value: {
      ...segment.value,
      value:
        segment.value.type === 'absolute' ? formatCentAmount(segment.value.value, fractionDigits) : segment.value.value, // percentages stay as-is
    },
    discountedAmount: formatCentAmount(segment.discountedAmount, fractionDigits),
  }));
}
