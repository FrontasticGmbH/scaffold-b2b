import { Meta, StoryFn } from '@storybook/react';
import Table from '.';
import Button from '../button';

export default {
  title: 'Atoms/Table',
  component: Table,
  tags: ['autodocs'],
} as Meta<typeof Table>;

const Template: StoryFn<typeof Table> = () => (
  <Table>
    <Table.Container>
      <Table.Head>
        <Table.Row>
          <Table.Cell className="w-1/5">LABEL</Table.Cell>
          <Table.Cell className="w-1/5">LABEL</Table.Cell>
          <Table.Cell className="w-1/5">LABEL</Table.Cell>
          <Table.Cell className="w-1/5">LABEL</Table.Cell>
          <Table.Cell className="text-right md:w-auto">LABEL</Table.Cell>
          <Table.Cell isButtonsHead />
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.Cell className="w-1/5">TEXT</Table.Cell>
          <Table.Cell className="w-1/5">TEXT</Table.Cell>
          <Table.Cell className="w-1/5">TEXT</Table.Cell>
          <Table.Cell className="w-1/5">TEXT</Table.Cell>
          <Table.Cell className="md:w-auto">{444444}</Table.Cell>
          <Table.Cell isButtonsCell>
            <Button variant="secondary">view</Button>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell className="w-1/5">TEXT</Table.Cell>
          <Table.Cell className="w-1/5">TEXT</Table.Cell>
          <Table.Cell className="w-1/5">TEXT</Table.Cell>
          <Table.Cell className="w-1/5">TEXT</Table.Cell>
          <Table.Cell className="md:w-auto">{444444}</Table.Cell>
          <Table.Cell isButtonsCell>
            <Button variant="secondary">view</Button>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Container>

    <Table.Pagination
      className="px-4"
      page={1}
      limit={25}
      totalItems={2}
      disablePrevious
      onRowsPerPageChange={(value) => console.log(value)}
    />
  </Table>
);

export const Default = Template.bind({});
Default.args = {};
