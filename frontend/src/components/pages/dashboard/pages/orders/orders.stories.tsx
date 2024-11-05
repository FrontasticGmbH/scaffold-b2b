import { useMemo, useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { orders } from '@/mocks/orders';
import OrdersPage from '.';

export default {
  title: 'Pages/Orders',
  component: OrdersPage,
} as Meta<typeof OrdersPage>;

const Template: StoryFn<typeof OrdersPage> = ({ orders, statusOptions, ...args }) => {
  const [search, setSearch] = useState('');

  const [statuses, setStatuses] = useState<string[]>([]);

  const [date, setDate] = useState({ from: '', to: '' });

  const [limit, setLimit] = useState<number>(25);

  const onCreationDateRefine = ({ from, to }: { from?: Date; to?: Date }) => {
    setDate({ from: from?.toISOString() ?? '', to: to?.toISOString() ?? '' });
  };

  const filteredOrders = useMemo(() => {
    let filtered = orders;

    if (search) filtered = filtered.filter((order) => order.number.includes(search));

    if (statuses.length > 0)
      filtered = filtered.filter((order) =>
        statuses.includes((statusOptions.find((s) => s.name === order.status) as (typeof statusOptions)[0]).value),
      );

    if (date.from) filtered = filtered.filter((order) => new Date(order.creationDate) >= new Date(date.from));
    if (date.to) filtered = filtered.filter((order) => new Date(order.creationDate) <= new Date(date.to));

    return filtered;
  }, [orders, search, statuses, statusOptions, date.from, date.to]);

  return (
    <OrdersPage
      {...args}
      filters={{ search, status: statuses, createdFrom: date.from, createdTo: date.to }}
      orders={filteredOrders}
      statusOptions={statusOptions}
      onStatusRefine={setStatuses}
      onSearch={setSearch}
      onCreationDateRefine={onCreationDateRefine}
      limit={limit}
      onRowsPerPageChange={(newLimit) => setLimit(+newLimit)}
      sortOptions={[]}
    />
  );
};

export const Primary = Template.bind({});
Primary.args = {
  orders,
  totalItems: 4,
  page: 1,
  statusOptions: [
    { name: 'Delivered', value: 'delivered' },
    { name: 'Pending', value: 'pending' },
    { name: 'Cancelled', value: 'cancelled' },
    { name: 'Confirmed', value: 'confirmed' },
  ],
};
