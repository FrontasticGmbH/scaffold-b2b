import { renderHook } from '@testing-library/react';
import { useScrollbarWidth } from '.';

describe('[Hook] useScrollbarWidth', () => {
  it('should return 0 when document is undefined', () => {
    // Mocking document as undefined
    const originalDocument = global.document;
    global.document = undefined as unknown as Document;

    const { result } = renderHook(() => useScrollbarWidth());

    expect(result.current).toBe(0);

    // Restore the original document object
    global.document = originalDocument;
  });

  it('should correctly calculate scrollbar width when document is defined', () => {
    const originalCreateElement = document.createElement;

    const createElementMock = jest.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      const callNumber = createElementMock.mock.calls.length - 1;
      const element = originalCreateElement.call(document, tagName);
      /**
       * since this hooks works with offset width, i am mocking the createElement function on docyment and
       * when it's called for the first time, i create a div with offset width 100 and on the next
       * call, one with offset width 90 and then expect the difference to be 10 when the hook runs
       */
      if (tagName === 'div') {
        if (callNumber === 1) {
          Object.defineProperty(element, 'offsetWidth', { value: 100 });
        } else if (callNumber === 2) {
          Object.defineProperty(element, 'offsetWidth', { value: 90 });
        }
      }

      return element;
    });

    // Now, when the hook runs, it will create and use the mocked divs with the offsetWidth values you defined
    const { result } = renderHook(() => useScrollbarWidth());

    // Check the calculated scrollbar width
    expect(result.current).toBe(10);

    // Clean up mocks
    jest.restoreAllMocks();
  });
});
