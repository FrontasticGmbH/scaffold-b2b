'use client';

import dynamic from 'next/dynamic';
import { TasticProps } from '../types';
import { Props } from './types';

const CartClientWrapper = dynamic(() => import('./components/cart-client-wrapper'));

const CartTastic = (props: TasticProps<Props>) => {
  return <CartClientWrapper {...props} />;
};

export default CartTastic;
