import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";

import { getActivityFeed } from "../services/get-activity-feed";
import { ActivityFeedResponse } from "../types";

export const useActivityFeed = () => {
  return useInfiniteQuery<
    ActivityFeedResponse,
    Error,
    InfiniteData<ActivityFeedResponse>,
    string[],
    string | undefined
  >({
    queryKey: ["activity-feed"],
    queryFn: ({ pageParam }) => getActivityFeed(pageParam),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
};
