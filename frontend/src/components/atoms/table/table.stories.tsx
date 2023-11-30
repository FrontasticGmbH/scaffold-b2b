import { Meta, StoryFn } from '@storybook/react';
import Table from '.';

export default {
  title: 'Atoms/Table',
  component: Table,
  tags: ['autodocs'],
} as Meta<typeof Table>;

const Template: StoryFn<typeof Table> = () => (
  <Table className="h-[90vh]">
    <Table.Container>
      <Table.Head>
        <Table.Row>
          <Table.Cell>ID</Table.Cell>
          <Table.Cell sortable>Name</Table.Cell>
          <Table.Cell>Phone</Table.Cell>
        </Table.Row>
      </Table.Head>

      <Table.Body>
        <Table.Row>
          <Table.Cell>98191891</Table.Cell>
          <Table.Cell>John</Table.Cell>
          <Table.Cell>0202020202</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Container>

    <Table.Pagination page={1} limit={15} totalItems={50} onRowsPerPageChange={(value) => console.log(value)} />
  </Table>
);

export const Default = Template.bind({});
Default.args = {};
