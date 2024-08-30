import { renderHook } from '__test__/utils';
import useControllableState from '.';

describe('useControllableState', () => {
  it('should return an array of exactly two values, the state and a function', () => {
    const { result } = renderHook(() => useControllableState());
    expect(result.current.length).toBe(2);
    expect(typeof result.current[1]).toBe('function');
  });

  it('should return the propValue when it is not null or undefined', () => {
    const propValue = { name: 'propValue' };
    const initialValue = { name: 'initialValue' };
    const { result } = renderHook(() => useControllableState(propValue, initialValue));
    const [state] = result.current;
    expect(state).toEqual(propValue);
  });

  it('should return the initialValue when propValue is nullish', () => {
    const initialValue = { price: 10.99 };
    const { result } = renderHook(() => useControllableState(null, initialValue));
    const [state] = result.current;
    expect(state).toEqual(initialValue);
  });
});
