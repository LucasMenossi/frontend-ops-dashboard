import { create } from "zustand";

interface PendingRealtimeUpdatesStore {
  hasPendingUpdates: boolean;

  setHasPendingUpdates: (value: boolean) => void;
}

export const usePendingRealtimeUpdates = create<PendingRealtimeUpdatesStore>(
  (set) => ({
    hasPendingUpdates: false,

    setHasPendingUpdates: (value) => {
      set({
        hasPendingUpdates: value,
      });
    },
  }),
);
