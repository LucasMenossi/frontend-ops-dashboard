import { faker } from "@faker-js/faker";

import { ActivityEvent } from "../../activity/types";

export const activityEvents: ActivityEvent[] = Array.from(
  { length: 500 },
  () => ({
    id: faker.string.uuid(),
    type: faker.helpers.arrayElement([
      "transaction.updated",
      "transaction.created",
      "bulk.completed",
    ]),
    transactionId: faker.string.uuid(),
    message: faker.helpers.arrayElement([
      "Transaction marked as completed",
      "Transaction refunded",
      "Bulk update executed",
      "Admin changed status",
    ]),
    createdAt: faker.date
      .recent({
        days: 30,
      })
      .toISOString(),
  }),
).sort(
  (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
);
