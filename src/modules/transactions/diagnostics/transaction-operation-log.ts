type OperationLog = {
  id: string;

  uiId: string;

  transactionId: string;

  type: "optimistic" | "replay" | "realtime" | "rollback";

  createdAt: string;
};

const MAX_OPERATIONS = 50;

const operations: OperationLog[] = [];

export const logOperation = (operation: Omit<OperationLog, "uiId">) => {
  operations.unshift({
    ...operation,

    uiId: crypto.randomUUID(),
  });

  operations.splice(MAX_OPERATIONS);
};

export const getOperations = () => operations;
