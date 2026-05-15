import { createMetadata } from "../../../../test/factories/metadata-factory";
import { createTransaction } from "../../../../test/factories/transaction-factory";
import { reconcileTransaction } from "./reconcile-transaction";
import { describe, expect, it } from "vitest";

describe("reconcileTransaction", () => {
  it("accepts newer versions", () => {
    const result = reconcileTransaction({
      current: createTransaction({
        status: "pending",
        version: 1,
      }),
      incoming: createTransaction({
        status: "completed",
        version: 2,
        updatedAt: "2026-05-14T11:00:00Z",
      }),
    });

    expect(result.transaction.status).toBe("completed");
  });

  it("rejects stale versions", () => {
    const result = reconcileTransaction({
      current: createTransaction({
        status: "completed",
        version: 5,
      }),
      incoming: createTransaction({
        status: "failed",
        version: 2,
      }),
    });

    expect(result.transaction.status).toBe("completed");
  });

  it("keeps optimistic updates when remote is older", () => {
    const result = reconcileTransaction({
      current: createTransaction({
        status: "processing",
        version: 4,
      }),

      incoming: createTransaction({
        status: "completed",
        version: 3,
      }),

      metadata: createMetadata({
        syncState: "optimistic",

        optimisticVersion: 4,

        isDirty: true,
      }),
    });

    expect(result.transaction.status).toBe("processing");

    expect(result.shouldFinalizeOptimistic).toBe(false);
  });
});
