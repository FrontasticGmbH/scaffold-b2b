'use client';

import dynamic from 'next/dynamic';

const AddressesClientWrapper = dynamic(() => import('./components/addresses-client-wrapper'));

const AddressesTastic = () => {
  return <AddressesClientWrapper />;
};

export default AddressesTastic;
