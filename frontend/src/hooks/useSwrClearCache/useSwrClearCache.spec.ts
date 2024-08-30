import { renderHook } from '@test/utils';
import { useSWRConfig } from 'swr';
import useSwrClearCache from '.';

jest.mock('swr');

describe('[Hook] useSwrClearCache', () => {
  it('Clears the whole cache for swr correctly', () => {
    const mutate = jest.fn((cb, data, options) => {
      return [cb(), data, options];
    });

    //eslint-disable-next-line
    (useSWRConfig as jest.Mock<any, any, any>).mockReturnValue({ mutate });

    const { result } = renderHook(useSwrClearCache);

    result.current();

    expect(mutate).toHaveBeenCalled();
    expect(mutate).toHaveReturnedWith([true, undefined, { revalidate: false }]);
  });
});
