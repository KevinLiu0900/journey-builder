import { renderHook, waitFor, act } from '@testing-library/react';
import { useFetch } from '../../hooks/use-fetch';
import ky from 'ky';

jest.mock('ky', () => {
  const kyMock: any = {
    get: jest.fn(),
  };
  kyMock.create = jest.fn(() => kyMock);
  return kyMock;
});

describe('useFetch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch data successfully', async () => {
    const mockData = { id: 1, name: 'Test' };
    (ky.create as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue({
        json: jest.fn().mockResolvedValue(mockData),
      }),
    });

    const { result } = renderHook(() => useFetch('/api/test'));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();

    expect(ky.create).toHaveBeenCalledWith(
      expect.objectContaining({
        timeout: 10000,
        retry: expect.objectContaining({ limit: 3 }),
      })
    );
  });

  it('should unwrap data if result has a data property', async () => {
    const mockData = { data: { id: 1, name: 'Test' } };
    (ky.create as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue({
        json: jest.fn().mockResolvedValue(mockData),
      }),
    });

    const { result } = renderHook(() => useFetch('/api/test'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData.data);
  });

  it('should handle Error instances', async () => {
    const error = new Error('Network error');
    (ky.create as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue({
        json: jest.fn().mockRejectedValue(error),
      }),
    });

    const { result } = renderHook(() => useFetch('/api/test'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toEqual(new Error('Network error'));
  });

  it('should handle non-Error instances', async () => {
    (ky.create as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue({
        json: jest.fn().mockRejectedValue('String error'),
      }),
    });

    const { result } = renderHook(() => useFetch('/api/test'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toEqual(new Error('String error'));
  });

  it('should support retry', async () => {
    const mockData1 = { id: 1 };
    const mockData2 = { id: 2 };

    const getMock = jest
      .fn()
      .mockReturnValueOnce({ json: jest.fn().mockResolvedValue(mockData1) })
      .mockReturnValueOnce({ json: jest.fn().mockResolvedValue(mockData2) });

    (ky.create as jest.Mock).mockReturnValue({
      get: getMock,
    });

    const { result } = renderHook(() => useFetch('/api/test'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData1);

    // Call retry
    act(() => {
      result.current.retry();
    });

    await waitFor(() => {
      expect(getMock).toHaveBeenCalledTimes(2);
      expect(result.current.data).toEqual(mockData2);
    });
  });

  it('should use provided options', async () => {
    const mockData = { id: 1 };
    (ky.create as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue({
        json: jest.fn().mockResolvedValue(mockData),
      }),
    });

    const { result } = renderHook(() =>
      useFetch('/api/test', {
        retries: 5,
        timeout: 5000,
      })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(ky.create).toHaveBeenCalledWith(
      expect.objectContaining({
        timeout: 5000,
        retry: expect.objectContaining({ limit: 5 }),
      })
    );
  });
});
