import { Meta, StoryFn } from '@storybook/react';
import PurchaseListsPage from '.';

export default {
  title: 'Pages/Purchase Lists',
  component: PurchaseListsPage,
} as Meta<typeof PurchaseListsPage>;

const Template: StoryFn<typeof PurchaseListsPage> = (args) => <PurchaseListsPage {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  purchaseLists: [
    {
      id: '0',
      name: 'Brake Pedals',
      store: { id: '1', key: 'greenville', name: 'Greenville' },
      description: 'Model X brakes',
      items: [
        {
          id: '0',
          sku: '54af877',
          url: '#',
          name: 'Brake Pad Set, disc brake DELPHI LP20',
          inStock: true,
          manufacturer: 'ERA',
          partNumber: '770035A',
          pressure: '0,3 bar',
          weight: '563 gram',
          price: 734.64,
          currency: 'USD',
          quantity: 1,
        },
      ],
    },
    {
      id: '1',
      name: 'Heaters',
      store: { id: '2', key: 'berlin', name: 'Berlin' },
      description: 'Heater system parts',
      items: [],
    },
    {
      id: '2',
      name: 'Winter Equipment',
      store: { id: '3', key: 'manhattan', name: 'Manhattan' },
      description: 'Audi & Volvo winter for winter equipment',
      items: [],
    },
  ],
};
