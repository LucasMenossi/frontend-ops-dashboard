import { create } from "zustand";

interface SelectionStore {
  selectedRows: Set<string>;

  toggleRow: (transactionId: string) => void;

  isSelected: (transactionId: string) => boolean;
}

export const useRowSelection = create<SelectionStore>((set, get) => ({
  selectedRows: new Set(),

  toggleRow: (transactionId) => {
    set((state) => {
      const next = new Set(state.selectedRows);

      if (next.has(transactionId)) {
        next.delete(transactionId);
      } else {
        next.add(transactionId);
      }

      return {
        selectedRows: next,
      };
    });
  },

  isSelected: (transactionId) => get().selectedRows.has(transactionId),
}));
