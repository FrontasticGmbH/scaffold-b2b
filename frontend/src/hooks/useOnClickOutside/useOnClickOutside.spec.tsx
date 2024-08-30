import { renderHook, render, fireEvent, screen } from '@testing-library/react';
import useOnClickOutside from '.';

describe('[Hook] useOnClickOutside', () => {
  let setShowDisabledMessage: jest.Mock;
  let ref: React.MutableRefObject<HTMLDivElement | null>;

  beforeEach(() => {
    setShowDisabledMessage = jest.fn();

    const { result } = renderHook(() => useOnClickOutside(() => setShowDisabledMessage({})));

    ref = result.current.ref;

    render(
      <>
        <div ref={ref} data-testid="inside-element">
          Test Content
        </div>
        <div data-testid="outside-element">Outside</div>
      </>,
    );
  });

  test('should not call setShowDisabledMessage when clicking inside the component', () => {
    fireEvent.mouseUp(screen.getByTestId('inside-element'));
    expect(setShowDisabledMessage).not.toHaveBeenCalled();
  });

  test('should call setShowDisabledMessage when clicking outside the component', () => {
    fireEvent.mouseUp(screen.getByTestId('outside-element'));
    expect(setShowDisabledMessage).toHaveBeenCalledWith({});
  });

  test('should call setShowDisabledMessage when pressing Escape', () => {
    fireEvent.keyUp(document, { key: 'Escape' });
    expect(setShowDisabledMessage).toHaveBeenCalledWith({});
  });
});
