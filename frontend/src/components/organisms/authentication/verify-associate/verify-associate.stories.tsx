import { Meta, StoryFn } from '@storybook/react';
import logoSrc from 'public/THE B2B STORE.svg';
import { image } from '@/mocks/image';
import VerifyAssociate from '.';

export default {
  title: 'Organisms/Verify Associate',
  component: VerifyAssociate,
} as Meta<typeof VerifyAssociate>;

const Template: StoryFn<typeof VerifyAssociate> = (args) => <VerifyAssociate {...args} />;

export const Default = Template.bind({});
Default.args = {
  logoLink: { href: '/' },
  logo: { src: logoSrc },
  image: {
    src: image.url,
    width: 680,
    height: 340,
    alt: '',
  },
  company: 'commercetools GmbH',
};
