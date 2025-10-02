import * as Toast from '@radix-ui/react-toast';
import { create } from 'zustand';
import { useEffect } from 'react';

type ToastItem = { id: string; title?: string; description?: string; variant?: 'success' | 'error' };

type ToastState = {
  current?: ToastItem;
  queue: ToastItem[];
  push: (t: Omit<ToastItem, 'id'>) => void;
  pop: () => void;
};

export const useToastStore = create<ToastState>((set, get) => ({
  current: undefined,
  queue: [],
  push: (t) => set((s) => ({ queue: [...s.queue, { id: crypto.randomUUID(), ...t }] })),
  pop: () => {
    const [, ...rest] = get().queue;
    set({ queue: rest });
  },
}));

export function showToast(t: Omit<ToastItem, 'id'>) {
  useToastStore.getState().push(t);
}

export function ToastProvider() {
  const { current, queue, pop } = useToastStore();
  const item = current ?? queue[0];
  useEffect(() => {
    if (!current && queue.length > 0) {
      useToastStore.setState({ current: queue[0] });
    }
  }, [current, queue]);

  return (
    <Toast.Provider swipeDirection="right">
      {item && (
        <Toast.Root
          duration={2500}
          onOpenChange={(open) => {
            if (!open) {
              useToastStore.setState({ current: undefined });
              pop();
            }
          }}
          style={{
            background: item.variant === 'error' ? '#7f1d1d' : '#065f46',
            color: 'white',
            borderRadius: 8,
            padding: '10px 12px',
            boxShadow: '0 10px 20px rgba(0,0,0,.3)'
          }}
          open
        >
          {item.title && <Toast.Title style={{ fontWeight: 600 }}>{item.title}</Toast.Title>}
          {item.description && <Toast.Description>{item.description}</Toast.Description>}
        </Toast.Root>
      )}
      <Toast.Viewport style={{ position: 'fixed', bottom: 16, right: 16, width: 360, zIndex: 50 }} />
    </Toast.Provider>
  );
}


