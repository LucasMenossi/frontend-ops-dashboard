import { QueuedMutation } from "../store/use-offline-mutation-queue";

export const compactMutationQueue = (queue: QueuedMutation[]) => {
  const latestByTransaction = new Map<string, QueuedMutation>();

  queue.forEach((mutation) => {
    const existing = latestByTransaction.get(mutation.transactionId);

    if (
      existing &&
      new Date(existing.createdAt).getTime() >
        new Date(mutation.createdAt).getTime()
    ) {
      return;
    }

    latestByTransaction.set(mutation.transactionId, mutation);
  });

  return Array.from(latestByTransaction.values()).sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
};
