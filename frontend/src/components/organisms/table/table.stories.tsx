import { Meta, StoryFn } from '@storybook/react';
import Table from '.';
import Button from '../../atoms/button';

export default {
  title: 'Organisms/Table',
  component: Table,
  tags: ['autodocs'],
} as Meta<typeof Table>;

// Table Component

const Template: StoryFn<typeof Table> = () => (
  <Table>
    <Table.Container>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>LABEL</Table.HeaderCell>
          <Table.HeaderCell>LABEL</Table.HeaderCell>
          <Table.HeaderCell>LABEL</Table.HeaderCell>
          <Table.HeaderCell>LABEL</Table.HeaderCell>
          <Table.HeaderCell className="text-right">LABEL</Table.HeaderCell>
          <Table.HeaderCell />
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.Cell>TEXT</Table.Cell>
          <Table.Cell>TEXT</Table.Cell>
          <Table.Cell>TEXT</Table.Cell>
          <Table.Cell>TEXT</Table.Cell>
          <Table.Cell className="text-right">{444444}</Table.Cell>
          <Table.Cell isButtonsCell>
            <Button variant="secondary">view</Button>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>TEXT</Table.Cell>
          <Table.Cell>TEXT</Table.Cell>
          <Table.Cell>TEXT</Table.Cell>
          <Table.Cell>TEXT</Table.Cell>
          <Table.Cell className="text-right">{444444}</Table.Cell>
          <Table.Cell isButtonsCell>
            <Button variant="secondary">view</Button>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Container>

    <Table.Pagination page={1} limit={25} totalItems={2} onRowsPerPageChange={(value) => console.log(value)} />
  </Table>
);

export const Default = Template.bind({});
Default.args = {};
