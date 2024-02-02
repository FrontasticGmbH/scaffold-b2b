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
      store: 'Greenville',
      description: 'Model X brakes',
      items: [
        {
          id: '0',
          sku: '54af877',
          name: 'Brake Pad Set, disc brake DELPHI LP20',
          model: 'SHXM4AY55N',
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
      store: 'Berlin',
      description: 'Heater system parts',
      items: [],
    },
    {
      id: '2',
      name: 'Winter Equipment',
      store: 'Manhattan',
      description: 'Audi & Volvo winter for winter equipment',
      items: [],
    },
  ],
};
