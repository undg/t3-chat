import { renderHook } from '@testing-library/react-hooks';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useWsStatus } from './use-ws-status';
import { socket } from '~/server/socket';
import { act } from 'react';

vi.mock('~/server/socket', () => ({
  socket: {
    connected: false,
    on: vi.fn(),
    off: vi.fn(),
    io: {
      engine: {
        transport: { name: 'websocket' },
        on: vi.fn()
      }
    }
  }
}));

describe('useWsStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initial state correct', () => {
    const { result } = renderHook(() => useWsStatus());
    expect(result.current).toEqual({ isConnected: false, transport: 'N/A' });
  });

  it('connects correctly', () => {
    socket.connected = true;
    const { result } = renderHook(() => useWsStatus());
    expect(result.current).toEqual({ isConnected: true, transport: 'websocket' });
  });

  it('handles disconnect', () => {
    const { result } = renderHook(() => useWsStatus());
    act(() => {
      // @ts-expect-error -- mock is explicitly added in test env
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      socket.on.mock.calls[1][1](); // Call disconnect handler
    });
    expect(result.current).toEqual({ isConnected: false, transport: 'N/A' });
  });
});
