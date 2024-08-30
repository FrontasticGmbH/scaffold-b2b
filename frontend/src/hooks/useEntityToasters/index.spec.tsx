import { renderHook } from '@testing-library/react';
import toast from '@/components/atoms/toaster/helpers/toast';
import useEntityToasters from '@/hooks/useEntityToasters';

jest.mock('@/components/atoms/toaster/helpers/toast');

describe('[Hook] useEntityToasters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call toast.success with the correct message when showSavedMessage is called', () => {
    const { result } = renderHook(() => useEntityToasters('user'));

    result.current.showSavedMessage();

    expect(toast.success).toHaveBeenCalledWith('dashboard.entity.user.saved', {
      position: 'top-right',
    });
  });

  it('should call toast.error with the correct message when showFailedMessage is called', () => {
    const { result } = renderHook(() => useEntityToasters('user'));

    result.current.showFailedMessage();

    expect(toast.error).toHaveBeenCalledWith('dashboard.entity.user.failed', {
      position: 'top-right',
    });
  });

  it('should call toast.success with the correct message when showDeletedMessage is called', () => {
    const { result } = renderHook(() => useEntityToasters('user'));

    result.current.showDeletedMessage();

    expect(toast.success).toHaveBeenCalledWith('dashboard.entity.user.deleted', {
      position: 'top-right',
    });
  });

  it('should call toast.error with the correct message when showDeletedFailedMessage is called', () => {
    const { result } = renderHook(() => useEntityToasters('user'));

    result.current.showDeletedFailedMessage();

    expect(toast.error).toHaveBeenCalledWith('dashboard.entity.user.deleted.failed', {
      position: 'top-right',
    });
  });
});
