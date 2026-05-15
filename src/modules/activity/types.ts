export type ActivityType =
  | "transaction.updated"
  | "transaction.created"
  | "transaction.deleted"
  | "bulk.completed";

export interface ActivityEvent {
  id: string;
  type: ActivityType;
  transactionId?: string;
  message: string;
  createdAt: string;
}

export interface ActivityFeedResponse {
  data: ActivityEvent[];
  nextCursor?: string | null;
}
