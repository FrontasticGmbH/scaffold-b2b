import { useRouter } from 'next/navigation';
import { render } from '@test/utils';
import Redirect from '.';

jest.mock('next/navigation', () => {
  const router = {
    push: jest.fn(),
  };
  return {
    useRouter: jest.fn().mockReturnValue(router),
  };
});

describe('Redirect', () => {
  it('should not redirect when the "to" prop is empty', () => {
    render(<Redirect to="" />);
    expect(useRouter().push).not.toHaveBeenCalled();
  });

  it('should redirect to the "to" route when it is passed', () => {
    render(<Redirect to="/products" />);
    expect(useRouter().push).toHaveBeenCalledWith('/products');
  });
});
