import { ReactElement } from 'react';
import Typography from '../../typography';

type ToastMessageProps = {
  children: ReactElement<any, any> | string; // explicitly allows any React element or a string
};

const ToastMessage = ({ children }: ToastMessageProps) => (
  <Typography className="text-gray-700" fontSize={14}>
    {typeof children === 'string' ? children : children.props?.children}
  </Typography>
);

export default ToastMessage;
