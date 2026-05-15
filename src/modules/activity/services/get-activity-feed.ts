import { activityEvents } from "./mock-activity-data";

import { ActivityFeedResponse } from "../types";

const PAGE_SIZE = 20;

export const getActivityFeed = async (
  cursor?: string,
): Promise<ActivityFeedResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  let startIndex = 0;

  if (cursor) {
    startIndex = activityEvents.findIndex((event) => event.id === cursor) + 1;
  }

  const page = activityEvents.slice(startIndex, startIndex + PAGE_SIZE);

  const nextCursor =
    page.length === PAGE_SIZE ? page[page.length - 1].id : null;

  return {
    data: page,
    nextCursor,
  };
};
