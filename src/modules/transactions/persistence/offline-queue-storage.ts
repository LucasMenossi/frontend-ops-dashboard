import { QueuedMutation } from "../store/use-offline-mutation-queue";

const STORAGE_KEY = "offline-transaction-queue";

const isBrowser = globalThis.window !== undefined;

export const saveOfflineQueue = (queue: QueuedMutation[]) => {
  if (!isBrowser) {
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
};

export const loadOfflineQueue = (): QueuedMutation[] => {
  if (!isBrowser) {
    return [];
  }

  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const clearOfflineQueueStorage = () => {
  if (!isBrowser) {
    return;
  }

  localStorage.removeItem(STORAGE_KEY);
};
