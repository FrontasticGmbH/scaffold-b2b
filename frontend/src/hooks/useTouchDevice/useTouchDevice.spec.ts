import { renderHook } from '@test/utils';
import useTouchDevice from '.';

describe('[Hook] useTouchDevice', () => {
  it('Returns correct response for touch devices based on touch points presence', () => {
    Object.assign(navigator, { maxTouchPoints: 1 });

    const {
      result: {
        current: { isTouchDevice },
      },
    } = renderHook(useTouchDevice);

    expect(isTouchDevice).toBe(true);
  });

  it('Returns correct response for touch devices based on `ontouchstart` handler presence', () => {
    Object.assign(window, { ontouchstart: () => {} });

    const {
      result: {
        current: { isTouchDevice },
      },
    } = renderHook(useTouchDevice);

    expect(isTouchDevice).toBe(true);
  });

  it('Returns correct response for non touch devices', () => {
    delete window.ontouchstart;
    Object.assign(navigator, { maxTouchPoints: 0 });

    const {
      result: {
        current: { isTouchDevice },
      },
    } = renderHook(useTouchDevice);

    expect(isTouchDevice).toBe(false);
  });
});
