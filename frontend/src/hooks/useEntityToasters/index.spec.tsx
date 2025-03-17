import { createWrapper, renderHook } from '@test/utils';
import toast from '@/components/atoms/toaster/helpers/toast';
import useEntityToasters from '@/hooks/useEntityToasters';

jest.mock('@/components/atoms/toaster/helpers/toast');

describe('[Hook] useEntityToasters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call toast.success with the correct message when showSavedMessage is called', () => {
    const { result } = renderHook(() => useEntityToasters('associate'), { wrapper: createWrapper() });

    result.current.showSavedMessage();

    expect(toast.success).toHaveBeenCalledWith('Associate saved successfully!', {
      position: 'top-right',
    });
  });

  it('should call toast.error with the correct message when showFailedMessage is called', () => {
    const { result } = renderHook(() => useEntityToasters('associate'), { wrapper: createWrapper() });

    result.current.showFailedMessage();

    expect(toast.error).toHaveBeenCalledWith("Couldn't save associate--", {
      position: 'top-right',
    });
  });

  it('should call toast.success with the correct message when showDeletedMessage is called', () => {
    const { result } = renderHook(() => useEntityToasters('associate'), { wrapper: createWrapper() });

    result.current.showDeletedMessage();

    expect(toast.success).toHaveBeenCalledWith('Associate removed successfully!', {
      position: 'top-right',
    });
  });

  it('should call toast.error with the correct message when showDeletedFailedMessage is called', () => {
    const { result } = renderHook(() => useEntityToasters('associate'), { wrapper: createWrapper() });

    result.current.showDeletedFailedMessage();

    expect(toast.error).toHaveBeenCalledWith("Couldn't delete associate--", {
      position: 'top-right',
    });
  });
});
