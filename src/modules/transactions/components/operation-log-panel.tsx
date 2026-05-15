"use client";

import { getOperations } from "@/modules/transactions/diagnostics/transaction-operation-log";

export const OperationLogPanel = () => {
  const operations = getOperations();

  return (
    <div className="rounded border p-4">
      <h3 className="font-bold">Operations</h3>

      <ul>
        {operations.map((operation) => (
          <li key={operation.uiId}>
            {operation.type}
            {" • "}
            {operation.transactionId}
          </li>
        ))}
      </ul>
    </div>
  );
};
