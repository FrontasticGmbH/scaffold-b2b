import { Cart } from '@shared/types/cart/Cart';
import { calculateTransaction } from './calculate-transaction';

describe('calculateTransaction', () => {
  describe('Subtotal Calculation', () => {
    describe('Tax-Inclusive Pricing', () => {
      it('should correctly divide by (1 + tax rate) instead of subtracting tax', () => {
        const cart: Partial<Cart> = {
          sum: {
            centAmount: 12100, // €121.00 including 21% VAT
            currencyCode: 'EUR',
            fractionDigits: 2,
          },
          lineItems: [
            {
              lineItemId: '1',
              count: 1,
              price: {
                centAmount: 12100,
                currencyCode: 'EUR',
                fractionDigits: 2,
              },
              totalPrice: {
                centAmount: 12100,
                currencyCode: 'EUR',
                fractionDigits: 2,
              },
              taxRate: {
                amount: 0.21,
                includedInPrice: true,
              },
              taxed: {
                taxAmount: {
                  centAmount: 2100,
                  currencyCode: 'EUR',
                  fractionDigits: 2,
                },
                netAmount: {
                  centAmount: 10000,
                  currencyCode: 'EUR',
                  fractionDigits: 2,
                },
              },
            },
          ],
          taxed: {
            taxAmount: {
              centAmount: 2100,
              currencyCode: 'EUR',
              fractionDigits: 2,
            },
          },
        };

        const result = calculateTransaction(cart);

        // Subtotal represents net (pre-tax) base for included-in-price pricing
        expect(result.subtotal.centAmount).toBe(10000);
      });

      it('should handle rounding correctly for real-world prices', () => {
        const cart: Partial<Cart> = {
          sum: {
            centAmount: 9999, // €99.99
            currencyCode: 'EUR',
            fractionDigits: 2,
          },
          lineItems: [
            {
              lineItemId: '1',
              count: 1,
              price: {
                centAmount: 9999,
                currencyCode: 'EUR',
                fractionDigits: 2,
              },
              totalPrice: {
                centAmount: 9999,
                currencyCode: 'EUR',
                fractionDigits: 2,
              },
              taxRate: {
                amount: 0.21,
                includedInPrice: true,
              },
              taxed: {
                taxAmount: {
                  centAmount: 1735,
                  currencyCode: 'EUR',
                  fractionDigits: 2,
                },
                netAmount: {
                  centAmount: 8264,
                  currencyCode: 'EUR',
                  fractionDigits: 2,
                },
              },
            },
          ],
          taxed: {
            taxAmount: {
              centAmount: 1735,
              currencyCode: 'EUR',
              fractionDigits: 2,
            },
          },
        };

        const result = calculateTransaction(cart);

        // Subtotal represents net (pre-tax) base for included-in-price pricing
        expect(result.subtotal.centAmount).toBe(8263);
      });

      it('should calculate correctly for bulk purchases with tax', () => {
        const cart: Partial<Cart> = {
          sum: {
            centAmount: 99900, // €999.00 total
            currencyCode: 'EUR',
            fractionDigits: 2,
          },
          lineItems: [
            {
              lineItemId: '1',
              count: 100,
              price: {
                centAmount: 999, // €9.99 per item including VAT
                currencyCode: 'EUR',
                fractionDigits: 2,
              },
              totalPrice: {
                centAmount: 99900,
                currencyCode: 'EUR',
                fractionDigits: 2,
              },
              taxRate: {
                amount: 0.21,
                includedInPrice: true,
              },
              taxed: {
                taxAmount: {
                  centAmount: 17355,
                  currencyCode: 'EUR',
                  fractionDigits: 2,
                },
                netAmount: {
                  centAmount: 82562,
                  currencyCode: 'EUR',
                  fractionDigits: 2,
                },
              },
            },
          ],
          taxed: {
            taxAmount: {
              centAmount: 17355,
              currencyCode: 'EUR',
              fractionDigits: 2,
            },
          },
        };

        const result = calculateTransaction(cart);

        expect(result.subtotal.centAmount).toBe(82500);
      });
    });

    describe('High Precision Pricing', () => {
      it('should handle commodity pricing with different fraction digits', () => {
        // Gold at $1,856.4375 per troy ounce
        const cart: Partial<Cart> = {
          sum: {
            centAmount: 185644,
            currencyCode: 'USD',
            fractionDigits: 2,
          },
          lineItems: [
            {
              lineItemId: '1',
              count: 1,
              price: {
                centAmount: 18564375, // 4 decimal precision
                currencyCode: 'USD',
                fractionDigits: 4,
              },
              totalPrice: {
                centAmount: 185644,
                currencyCode: 'USD',
                fractionDigits: 2,
              },
            },
          ],
        };

        const result = calculateTransaction(cart);

        expect(result.subtotal.centAmount).toBe(18564375);
      });
    });

    describe('B2B Wholesale Pricing', () => {
      it('should correctly calculate bulk orders with fractional cent pricing', () => {
        // Screws at $0.0047 each, ordering 50,000 units
        const cart: Partial<Cart> = {
          sum: {
            centAmount: 23500,
            currencyCode: 'USD',
            fractionDigits: 2,
          },
          lineItems: [
            {
              lineItemId: '1',
              count: 50000,
              price: {
                centAmount: 47, // $0.0047 with 4 decimal places
                currencyCode: 'USD',
                fractionDigits: 4,
              },
              totalPrice: {
                centAmount: 23500,
                currencyCode: 'USD',
                fractionDigits: 2,
              },
            },
          ],
        };

        const result = calculateTransaction(cart);

        expect(result.subtotal.centAmount).toBe(2350000);
      });
    });

    describe('Combined Tax + Precision Issues', () => {
      it('should handle both tax-inclusive pricing and different fraction digits', () => {
        // Fuel at $3.4567/gallon including 8% tax, buying 100 gallons
        const cart: Partial<Cart> = {
          sum: {
            centAmount: 34567,
            currencyCode: 'USD',
            fractionDigits: 2,
          },
          lineItems: [
            {
              lineItemId: '1',
              count: 100,
              price: {
                centAmount: 34567, // $3.4567 per gallon
                currencyCode: 'USD',
                fractionDigits: 4,
              },
              totalPrice: {
                centAmount: 34567,
                currencyCode: 'USD',
                fractionDigits: 2,
              },
              taxRate: {
                amount: 0.08,
                includedInPrice: true,
              },
              taxed: {
                taxAmount: {
                  centAmount: 2561,
                  currencyCode: 'USD',
                  fractionDigits: 2,
                },
                netAmount: {
                  centAmount: 32006,
                  currencyCode: 'USD',
                  fractionDigits: 2,
                },
              },
            },
          ],
          taxed: {
            taxAmount: {
              centAmount: 2561,
              currencyCode: 'USD',
              fractionDigits: 2,
            },
          },
        };

        const result = calculateTransaction(cart);

        expect(result.subtotal.centAmount).toBe(3200600);
      });
    });

    describe('Edge cases', () => {
      it('should handle line items without fraction digits', () => {
        const cart: Partial<Cart> = {
          sum: {
            centAmount: 10000,
            currencyCode: 'USD',
            fractionDigits: 2,
          },
          lineItems: [
            {
              lineItemId: '1',
              count: 1,
              price: {
                centAmount: 10000,
                currencyCode: 'USD',
              },
              totalPrice: {
                centAmount: 10000,
                currencyCode: 'USD',
                fractionDigits: 2,
              },
            },
          ],
        };

        const result = calculateTransaction(cart);

        expect(result.subtotal.centAmount).toBe(10000);
      });

      it('should handle empty cart', () => {
        const cart: Partial<Cart> = {};

        const result = calculateTransaction(cart);

        expect(result.subtotal.centAmount).toBe(0);
        expect(result.subtotal.currencyCode).toBe('USD');
        expect(result.subtotal.fractionDigits).toBe(2);
        expect(result.discount.segments).toEqual([]);
      });
    });
  });

  describe('Discount Calculation', () => {
    it('should calculate line item discounts correctly', () => {
      const cart: Partial<Cart> = {
        sum: {
          centAmount: 8000, // €80 after discount
          currencyCode: 'EUR',
          fractionDigits: 2,
        },
        lineItems: [
          {
            lineItemId: '1',
            count: 1,
            price: {
              centAmount: 10000, // €100 original price
              currencyCode: 'EUR',
              fractionDigits: 2,
            },
            totalPrice: {
              centAmount: 8000, // €80 after discount
              currencyCode: 'EUR',
              fractionDigits: 2,
            },
          },
        ],
      };

      const result = calculateTransaction(cart);

      // €20 discount
      expect(result.discount.centAmount).toBe(2000);
      // Should have segments for sale item savings
      expect(result.discount.segments).toHaveLength(1);
      expect(result.discount.segments[0]).toMatchObject({
        label: 'cart.sale-item-savings',
        value: { type: 'absolute', value: 2000 },
        discountedAmount: 2000,
      });
    });

    it('should handle multiple items with different discounts', () => {
      const cart: Partial<Cart> = {
        sum: {
          centAmount: 22500,
          currencyCode: 'USD',
          fractionDigits: 2,
        },
        lineItems: [
          {
            lineItemId: '1',
            count: 2,
            price: {
              centAmount: 5000, // $50 each
              currencyCode: 'USD',
              fractionDigits: 2,
            },
            totalPrice: {
              centAmount: 9000, // $90 total (10% off)
              currencyCode: 'USD',
              fractionDigits: 2,
            },
          },
          {
            lineItemId: '2',
            count: 1,
            price: {
              centAmount: 15000, // $150
              currencyCode: 'USD',
              fractionDigits: 2,
            },
            totalPrice: {
              centAmount: 13500, // $135 (10% off)
              currencyCode: 'USD',
              fractionDigits: 2,
            },
          },
        ],
      };

      const result = calculateTransaction(cart);

      // Total discount: $10 + $15 = $25
      expect(result.discount.centAmount).toBe(2500);
      // Should have segments for sale item savings
      expect(result.discount.segments).toHaveLength(1);
      expect(result.discount.segments[0]).toMatchObject({
        label: 'cart.sale-item-savings',
        value: { type: 'absolute', value: 2500 },
        discountedAmount: 2500,
      });
    });

    it('should handle gift items separately', () => {
      const cart: Partial<Cart> = {
        sum: {
          centAmount: 5000,
          currencyCode: 'USD',
          fractionDigits: 2,
        },
        lineItems: [
          {
            lineItemId: '1',
            count: 1,
            price: {
              centAmount: 5000,
              currencyCode: 'USD',
              fractionDigits: 2,
            },
            totalPrice: {
              centAmount: 5000,
              currencyCode: 'USD',
              fractionDigits: 2,
            },
          },
          {
            lineItemId: '2',
            count: 1,
            isGift: true,
            price: {
              centAmount: 2000, // $20 gift item
              currencyCode: 'USD',
              fractionDigits: 2,
            },
            totalPrice: {
              centAmount: 0, // Free gift
              currencyCode: 'USD',
              fractionDigits: 2,
            },
          },
        ],
      };

      const result = calculateTransaction(cart);

      // Total discount: $20 for gift item
      expect(result.discount.centAmount).toBe(2000);
      // Should have segments for gift item
      expect(result.discount.segments).toHaveLength(1);
      expect(result.discount.segments[0]).toMatchObject({
        label: 'cart.buy-get-promo',
        value: { type: 'absolute', value: 2000 },
        discountedAmount: 2000,
      });
    });

    it('should handle cart-level discount codes', () => {
      const cart: Partial<Cart> = {
        sum: {
          centAmount: 9000,
          currencyCode: 'USD',
          fractionDigits: 2,
        },
        lineItems: [
          {
            lineItemId: '1',
            count: 1,
            price: {
              centAmount: 10000,
              currencyCode: 'USD',
              fractionDigits: 2,
            },
            totalPrice: {
              centAmount: 10000,
              currencyCode: 'USD',
              fractionDigits: 2,
            },
          },
        ],
        discountOnTotalPrice: {
          discountedAmount: {
            centAmount: 1000,
            currencyCode: 'USD',
            fractionDigits: 2,
          },
          includedDiscounts: [
            {
              discount: {
                cartDiscountId: 'discount-1',
                name: '10% Off Total',
                discountValue: {
                  type: 'relative',
                  value: 10,
                },
              },
              discountedAmount: {
                centAmount: 1000,
                currencyCode: 'USD',
                fractionDigits: 2,
              },
            },
          ],
        },
        discountCodes: [
          {
            code: 'SAVE10',
            discounts: [
              {
                cartDiscountId: 'discount-1',
              },
            ],
          },
        ],
      };

      const result = calculateTransaction(cart);

      // Total discount: $10
      expect(result.discount.centAmount).toBe(1000);
      // Should have segments for discount code
      expect(result.discount.segments).toHaveLength(1);
      expect(result.discount.segments[0]).toMatchObject({
        source: 'SAVE10',
        label: '10% Off Total',
        value: { type: 'relative', value: 10 },
        discountedAmount: 1000,
      });
    });

    it('should handle multiple discount segments', () => {
      const cart: Partial<Cart> = {
        sum: {
          centAmount: 6800,
          currencyCode: 'USD',
          fractionDigits: 2,
        },
        lineItems: [
          {
            lineItemId: '1',
            count: 1,
            price: {
              centAmount: 10000,
              currencyCode: 'USD',
              fractionDigits: 2,
            },
            totalPrice: {
              centAmount: 8000, // $20 off
              currencyCode: 'USD',
              fractionDigits: 2,
            },
          },
          {
            lineItemId: '2',
            count: 1,
            isGift: true,
            price: {
              centAmount: 1000, // $10 gift
              currencyCode: 'USD',
              fractionDigits: 2,
            },
            totalPrice: {
              centAmount: 0,
              currencyCode: 'USD',
              fractionDigits: 2,
            },
          },
        ],
        discountOnTotalPrice: {
          discountedAmount: {
            centAmount: 1200, // Additional $12 off
            currencyCode: 'USD',
            fractionDigits: 2,
          },
          includedDiscounts: [
            {
              discount: {
                cartDiscountId: 'discount-1',
                name: '15% Off Cart',
                discountValue: {
                  type: 'relative',
                  value: 15,
                },
              },
              discountedAmount: {
                centAmount: 1200,
                currencyCode: 'USD',
                fractionDigits: 2,
              },
            },
          ],
        },
      };

      const result = calculateTransaction(cart);

      // Total discount: $20 + $10 + $12 = $42
      expect(result.discount.centAmount).toBe(4200);
      // Should have 3 segments
      expect(result.discount.segments).toHaveLength(3);
      expect(result.discount.segments[0].label).toBe('cart.sale-item-savings');
      expect(result.discount.segments[0].discountedAmount).toBe(2000);
      expect(result.discount.segments[1].label).toBe('cart.buy-get-promo');
      expect(result.discount.segments[1].discountedAmount).toBe(1000);
      expect(result.discount.segments[2].label).toBe('15% Off Cart');
      expect(result.discount.segments[2].discountedAmount).toBe(1200);
    });
  });

  describe('Shipping Calculation', () => {
    it('should use actual shipping when selected', () => {
      const cart: Partial<Cart> = {
        sum: {
          centAmount: 10000,
          currencyCode: 'USD',
          fractionDigits: 2,
        },
        lineItems: [
          {
            lineItemId: '1',
            count: 1,
            price: { centAmount: 10000, currencyCode: 'USD', fractionDigits: 2 },
            totalPrice: { centAmount: 10000, currencyCode: 'USD', fractionDigits: 2 },
          },
        ],
        shippingInfo: {
          shippingMethodId: '1',
          price: {
            centAmount: 999, // $9.99
            currencyCode: 'USD',
            fractionDigits: 2,
          },
        },
      };

      const result = calculateTransaction(cart);

      expect(result.shipping.centAmount).toBe(999);
      expect(result.shipping.isEstimated).toBe(false);
    });

    it('should not estimate shipping from available methods', () => {
      const cart: Partial<Cart> = {
        sum: {
          centAmount: 10000,
          currencyCode: 'USD',
          fractionDigits: 2,
        },
        lineItems: [
          {
            lineItemId: '1',
            count: 1,
            price: { centAmount: 10000, currencyCode: 'USD', fractionDigits: 2 },
            totalPrice: { centAmount: 10000, currencyCode: 'USD', fractionDigits: 2 },
          },
        ],
        availableShippingMethods: [
          {
            shippingMethodId: '1',
            rates: [
              {
                price: {
                  centAmount: 1500, // $15
                  currencyCode: 'USD',
                  fractionDigits: 2,
                },
              },
            ],
          },
        ],
      };

      const result = calculateTransaction(cart);

      expect(result.shipping.centAmount).toBe(0);
      expect(result.shipping.isEstimated).toBe(true);
    });

    it('should handle shipping with included tax', () => {
      const cart: Partial<Cart> = {
        sum: {
          centAmount: 10000,
          currencyCode: 'EUR',
          fractionDigits: 2,
        },
        lineItems: [
          {
            lineItemId: '1',
            count: 1,
            price: { centAmount: 10000, currencyCode: 'EUR', fractionDigits: 2 },
            totalPrice: { centAmount: 10000, currencyCode: 'EUR', fractionDigits: 2 },
          },
        ],
        shippingInfo: {
          shippingMethodId: '1',
          price: {
            centAmount: 1210, // €12.10 including tax
            currencyCode: 'EUR',
            fractionDigits: 2,
          },
          taxRate: {
            amount: 0.21,
            includedInPrice: true,
          },
          taxed: {
            taxAmount: {
              centAmount: 210, // €2.10 tax
              currencyCode: 'EUR',
              fractionDigits: 2,
            },
          },
        },
      };

      const result = calculateTransaction(cart);

      // Shipping uses taxed grossAmount
      expect(result.shipping.centAmount).toBe(1210);
    });
  });

  describe('Tax Calculation', () => {
    it('should calculate total tax from line items taxed amount', () => {
      const cart: Partial<Cart> = {
        sum: {
          centAmount: 12100,
          currencyCode: 'EUR',
          fractionDigits: 2,
        },
        lineItems: [
          {
            lineItemId: '1',
            count: 1,
            price: { centAmount: 12100, currencyCode: 'EUR', fractionDigits: 2 },
            totalPrice: { centAmount: 12100, currencyCode: 'EUR', fractionDigits: 2 },
            taxRate: { amount: 0.21, includedInPrice: true },
            taxed: {
              taxAmount: { centAmount: 2100, currencyCode: 'EUR', fractionDigits: 2 },
            },
          },
          {
            lineItemId: '2',
            count: 1,
            price: { centAmount: 12100, currencyCode: 'EUR', fractionDigits: 2 },
            totalPrice: { centAmount: 12100, currencyCode: 'EUR', fractionDigits: 2 },
            taxRate: { amount: 0.21, includedInPrice: true },
            taxed: {
              taxAmount: { centAmount: 2100, currencyCode: 'EUR', fractionDigits: 2 },
            },
          },
        ],
      };

      const result = calculateTransaction(cart);

      expect(result.tax.centAmount).toBe(4200);
    });

    it('should exclude taxes from total when not included in price', () => {
      const cart: Partial<Cart> = {
        sum: {
          centAmount: 10000,
          currencyCode: 'USD',
          fractionDigits: 2,
        },
        lineItems: [
          {
            lineItemId: '1',
            count: 1,
            price: { centAmount: 10000, currencyCode: 'USD', fractionDigits: 2 },
            totalPrice: { centAmount: 10000, currencyCode: 'USD', fractionDigits: 2 },
            taxRate: { amount: 0.08, includedInPrice: false },
            taxed: {
              taxAmount: {
                centAmount: 800, // $8 tax not included
                currencyCode: 'USD',
                fractionDigits: 2,
              },
            },
          },
        ],
        taxed: {
          netAmount: { fractionDigits: 2, centAmount: 10000, currencyCode: 'USD' },
          grossAmount: { fractionDigits: 2, centAmount: 10800, currencyCode: 'USD' },
          taxAmount: { fractionDigits: 2, centAmount: 800, currencyCode: 'USD' },
        },
      };

      const result = calculateTransaction(cart);

      // Under API-driven totals, total equals cart.taxed.grossAmount
      expect(result.total.centAmount).toBe(10800);
    });

    it('should return 0 tax when cart total is 0', () => {
      const cart: Partial<Cart> = {
        sum: {
          centAmount: 0,
          currencyCode: 'USD',
          fractionDigits: 2,
        },
        lineItems: [],
        taxed: {
          taxAmount: {
            centAmount: 100, // Some tax amount that should be ignored
            currencyCode: 'USD',
            fractionDigits: 2,
          },
        },
      };

      const result = calculateTransaction(cart);

      expect(result.tax.centAmount).toBe(0);
    });
  });

  describe('Total Calculation', () => {
    it('should calculate total correctly with all components', () => {
      const cart: Partial<Cart> = {
        sum: {
          centAmount: 22000,
          currencyCode: 'EUR',
          fractionDigits: 2,
        },
        lineItems: [
          {
            lineItemId: '1',
            count: 1,
            price: {
              centAmount: 12100, // €121 including tax
              currencyCode: 'EUR',
              fractionDigits: 2,
            },
            totalPrice: {
              centAmount: 11000, // €110 after discount
              currencyCode: 'EUR',
              fractionDigits: 2,
            },
            taxRate: { amount: 0.21, includedInPrice: true },
            taxed: {
              taxAmount: {
                centAmount: 1901, // Tax on discounted amount
                currencyCode: 'EUR',
                fractionDigits: 2,
              },
              netAmount: {
                centAmount: 10000,
                currencyCode: 'EUR',
                fractionDigits: 2,
              },
            },
          },
          {
            lineItemId: '2',
            count: 1,
            price: {
              centAmount: 12100, // €121 including tax
              currencyCode: 'EUR',
              fractionDigits: 2,
            },
            totalPrice: {
              centAmount: 11000, // €110 after discount
              currencyCode: 'EUR',
              fractionDigits: 2,
            },
            taxRate: { amount: 0.21, includedInPrice: true },
            taxed: {
              taxAmount: {
                centAmount: 1901,
                currencyCode: 'EUR',
                fractionDigits: 2,
              },
              netAmount: {
                centAmount: 10000,
                currencyCode: 'EUR',
                fractionDigits: 2,
              },
            },
          },
        ],
        taxed: {
          taxAmount: {
            centAmount: 1901,
            currencyCode: 'EUR',
            fractionDigits: 2,
          },
        },
      };

      const result = calculateTransaction(cart);

      // Verify all components
      expect(result.subtotal.centAmount).toBe(20000); // net base for included-in-price
      // In NET mode (cart.taxed present), originalNet equals discountedNet for these lines → 0 line-item discount
      expect(result.discount.centAmount).toBe(0);
      expect(result.tax.centAmount).toBe(3802);
      expect(result.total.centAmount).toBe(22000); // line items sum
    });

    it('should not include estimated shipping in total before shipping method selection', () => {
      const cart: Partial<Cart> = {
        sum: {
          centAmount: 5000,
          currencyCode: 'USD',
          fractionDigits: 2,
        },
        lineItems: [
          {
            lineItemId: '1',
            count: 1,
            price: { centAmount: 5000, currencyCode: 'USD', fractionDigits: 2 },
            totalPrice: { centAmount: 5000, currencyCode: 'USD', fractionDigits: 2 },
          },
        ],
        availableShippingMethods: [
          {
            shippingMethodId: '1',
            rates: [
              {
                price: {
                  centAmount: 999,
                  currencyCode: 'USD',
                  fractionDigits: 2,
                },
              },
            ],
          },
        ],
      };

      const result = calculateTransaction(cart);

      // $50 with no shipping selected (estimated shipping ignored)
      expect(result.total.centAmount).toBe(5000);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle missing prices gracefully', () => {
      const cart: Partial<Cart> = {
        sum: {
          centAmount: 0,
          currencyCode: 'USD',
          fractionDigits: 2,
        },
        lineItems: [
          {
            lineItemId: '1',
            count: 1,
            // Missing price
            totalPrice: { centAmount: 0, currencyCode: 'USD', fractionDigits: 2 },
          },
        ],
      };

      const result = calculateTransaction(cart);

      expect(result.subtotal.centAmount).toBe(0);
      expect(result.discount.centAmount).toBe(0);
    });

    it('should handle missing tax rate gracefully', () => {
      const cart: Partial<Cart> = {
        sum: {
          centAmount: 10000,
          currencyCode: 'USD',
          fractionDigits: 2,
        },
        lineItems: [
          {
            lineItemId: '1',
            count: 1,
            price: { centAmount: 10000, currencyCode: 'USD', fractionDigits: 2 },
            totalPrice: { centAmount: 10000, currencyCode: 'USD', fractionDigits: 2 },
            // Missing taxRate
          },
        ],
      };

      const result = calculateTransaction(cart);

      expect(result.subtotal.centAmount).toBe(10000);
    });

    it('should handle extreme quantities', () => {
      const cart: Partial<Cart> = {
        sum: {
          centAmount: 100000000, // $1,000,000
          currencyCode: 'USD',
          fractionDigits: 2,
        },
        lineItems: [
          {
            lineItemId: '1',
            count: 1000000, // 1 million items
            price: {
              centAmount: 100, // $1 each
              currencyCode: 'USD',
              fractionDigits: 2,
            },
            totalPrice: {
              centAmount: 100000000,
              currencyCode: 'USD',
              fractionDigits: 2,
            },
          },
        ],
      };

      const result = calculateTransaction(cart);

      expect(result.subtotal.centAmount).toBe(100000000);
      expect(result.total.centAmount).toBe(100000000);
    });

    it('should handle negative line items (returns)', () => {
      const cart: Partial<Cart> = {
        sum: {
          centAmount: 5000, // $50 after return
          currencyCode: 'USD',
          fractionDigits: 2,
        },
        lineItems: [
          {
            lineItemId: '1',
            count: 2,
            price: { centAmount: 5000, currencyCode: 'USD', fractionDigits: 2 },
            totalPrice: { centAmount: 10000, currencyCode: 'USD', fractionDigits: 2 },
          },
          {
            lineItemId: '2',
            count: -1, // Return
            price: { centAmount: 5000, currencyCode: 'USD', fractionDigits: 2 },
            totalPrice: { centAmount: -5000, currencyCode: 'USD', fractionDigits: 2 },
          },
        ],
      };

      const result = calculateTransaction(cart);

      expect(result.subtotal.centAmount).toBe(5000);
      expect(result.total.centAmount).toBe(5000);
    });
  });
});
