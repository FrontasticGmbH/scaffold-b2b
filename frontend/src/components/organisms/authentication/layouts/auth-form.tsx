import { PropsWithChildren } from 'react';
import Button from '@/components/atoms/button';
import Link from '@/components/atoms/link';
import Typography from '@/components/atoms/typography';
import { AuthFormProps } from '../types';

const AuthForm = ({
  title,
  subtitle,
  subtitleLink,
  subtitleLinkLabel,
  buttonLabel,
  footerLabel,
  footerLink,
  footerOnClick,
  footerLinkLabel,
  onSubmit,
  children,
}: PropsWithChildren<AuthFormProps>) => {
  return (
    <>
      <div className="grid h-fit gap-5">
        <Typography as="h1" fontSize={18} fontWeight="extrabold" className="text-gray-700">
          {title}
        </Typography>

        {subtitle && (
          <div className="flex items-center gap-1">
            <Typography fontSize={14} className="text-gray-600" lineHeight="loose">
              {subtitle}
            </Typography>
            {subtitleLink && subtitleLinkLabel && (
              <Link className="text-14 font-medium leading-loose text-gray-600 underline" href={subtitleLink}>
                {subtitleLinkLabel}
              </Link>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-3 md:mt-9">{children}</div>

      <Button className="mt-6 text-14 md:mt-9" onClick={onSubmit}>
        {buttonLabel}
      </Button>

      <div className="mt-4 flex w-full flex-wrap justify-center gap-1">
        {footerLabel && (
          <Typography fontSize={14} className="text-gray-600" lineHeight="loose">
            {footerLabel}
          </Typography>
        )}
        {footerLink && footerLinkLabel && (
          <Link href={footerLink} onClick={footerOnClick} className="text-14 leading-loose text-gray-600 underline">
            {footerLinkLabel}
          </Link>
        )}
      </div>
    </>
  );
};

export default AuthForm;
