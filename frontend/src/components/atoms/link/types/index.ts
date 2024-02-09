import NextLink from 'next/link';

export interface LinkProps extends React.ComponentProps<typeof NextLink> {
  openInNewTab?: boolean;
  chevron?: boolean;
  underlineOnHover?: boolean;
  locale?: string;
}
