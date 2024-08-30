import { FC, useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import Input from '../input';
import { InputProps } from '../input/types';

const PasswordInput: FC<InputProps> = (props) => {
  const [hidden, setHidden] = useState<boolean>(true);

  const toggleHidden = () => {
    setHidden(!hidden);
  };

  const iconProps: React.ComponentProps<typeof EyeSlashIcon> = {
    className: 'w-4 h-4',
    onClick: toggleHidden,
  };

  return (
    <Input
      type={hidden ? 'password' : 'text'}
      icon={
        hidden ? (
          <EyeSlashIcon data-testid="show-password-icon" {...iconProps} />
        ) : (
          <EyeIcon data-testid="hide-password-icon" {...iconProps} />
        )
      }
      className="py-[8px]"
      {...props}
    />
  );
};

export default PasswordInput;
