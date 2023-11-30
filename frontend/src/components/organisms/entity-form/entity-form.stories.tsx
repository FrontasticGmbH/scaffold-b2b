import { Meta, StoryFn } from '@storybook/react';
import Input from '@/components/atoms/input';
import EntityForm from '.';

export default {
  title: 'Organisms/Entity Form',
  component: EntityForm,
} as Meta<typeof EntityForm>;

const Template: StoryFn<typeof EntityForm> = (args) => <EntityForm {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  translations: {
    cancel: 'Cancel',
    submit: 'Save',
  },
  children: (
    <div className="flex flex-col gap-4">
      <Input className="w-[400px]" label="Name" defaultValue="commercetools" />
      <Input className="w-[400px]" label="Email" defaultValue="123@commercetools.com" />
      <Input className="w-[400px]" label="Country" showOptionalLabel />
      <Input className="w-[400px]" label="VAT Number" showOptionalLabel />
    </div>
  ),
};
