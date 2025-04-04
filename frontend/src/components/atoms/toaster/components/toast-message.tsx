import { ReactElement } from 'react';

type ToastMessageProps = {
  children: ReactElement<any, any> | string; // explicitly allows any React element or a string
};

const ToastMessage = ({ children }: ToastMessageProps) => (
  <p className="text-14 text-gray-700">{typeof children === 'string' ? children : children.props?.children}</p>
);

export default ToastMessage;
