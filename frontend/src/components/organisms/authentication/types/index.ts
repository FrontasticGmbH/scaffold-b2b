import { ImageProps } from '@/components/atoms/Image/types';
import { Image } from '@/types/image';
import { Link } from '@/types/link';

export type AuthFormProps = {
  includeCheckIcon?: boolean;
  error?: string;
  title: string;
  subtitle?: string;
  subtitleLink?: string;
  subtitleLinkLabel?: string;
  buttonLabel: string;
  footerLabel?: string;
  footerLink?: string;
  footerOnClick?: () => void;
  footerLinkLabel?: string;
  onSubmit: () => void;
};

export type AuthLayoutProps = {
  image: ImageProps;
  logo: Image;
  logoLink: Link;
};

export type AuthTemplatesProps = AuthFormProps & AuthLayoutProps;
