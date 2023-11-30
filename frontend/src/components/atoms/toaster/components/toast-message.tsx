import { PropsWithChildren, ReactElement } from 'react';
import Typography from '../../typography';

const ToastMessage = ({ children }: PropsWithChildren) => (
  <Typography className="text-gray-700" fontSize={14}>
    {(children as ReactElement).props ? (children as ReactElement).props.children : (children as string)}
  </Typography>
);

export default ToastMessage;
