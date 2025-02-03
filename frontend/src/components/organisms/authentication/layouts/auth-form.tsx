import { FormEvent, PropsWithChildren } from 'react';
import Button from '@/components/atoms/button';
import Link from '@/components/atoms/link';
import Typography from '@/components/atoms/typography';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { AuthFormProps } from '../types';

const AuthForm = ({
  title,
  subtitle,
  subtitleLink,
  subtitleLinkLabel,
  buttonLabel,
  footerLabel,
  footerLink,
  error,
  includeCheckIcon,
  footerOnClick,
  footerLinkLabel,
  onSubmit,
  children,
}: PropsWithChildren<AuthFormProps>) => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit?.();
  };

  return (
    <>
      <div className="grid h-fit gap-5">
        {includeCheckIcon && <CheckCircleIcon className="size-6 text-primary" />}

        <Typography as="h1" fontSize={18} fontWeight="bold" className="text-gray-700 md:text-20 lg:text-24">
          {title}
        </Typography>

        {subtitle && (
          <div className="flex items-center gap-1">
            <Typography fontSize={14} className="text-gray-600" lineHeight="loose">
              {subtitle}
            </Typography>
            {subtitleLink && subtitleLinkLabel && (
              <Link
                className="text-14 font-medium leading-loose text-gray-600 underline hover:text-gray-500"
                href={subtitleLink}
              >
                {subtitleLinkLabel}
              </Link>
            )}
          </div>
        )}
      </div>

      <form data-testid="auth-form" onSubmit={handleSubmit}>
        {children && (
          <div className="mt-6 grid gap-3 md:mt-9">
            {error && (
              <Typography fontSize={14} fontWeight="medium" className="text-red-500">
                {error}
              </Typography>
            )}

            {children}
          </div>
        )}

        <Button type="submit" size="full" className="mt-6 text-14 md:mt-9">
          {buttonLabel}
        </Button>
      </form>

      <div className="mt-4 flex w-full flex-wrap justify-center gap-1">
        {footerLabel && (
          <Typography fontSize={14} className="text-gray-600" lineHeight="loose">
            {footerLabel}
          </Typography>
        )}
        {footerLink && footerLinkLabel && (
          <Link
            href={footerLink}
            onClick={footerOnClick}
            className="text-14 leading-loose text-gray-600 underline hover:text-gray-500"
          >
            {footerLinkLabel}
          </Link>
        )}
      </div>
    </>
  );
};

export default AuthForm;
