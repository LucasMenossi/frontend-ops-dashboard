"use client";

import { useMemo } from "react";

import { useActivityFeed } from "../hooks/use-activity-feed";

export const ActivityFeed = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useActivityFeed();

  const activities = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data]);

  return (
    <div className="flex h-[600px] w-[400px] flex-col border-l">
      <div className="border-b p-4">
        <h2 className="font-semibold">Activity Feed</h2>
      </div>

      <div className="flex-1 overflow-auto">
        {activities.map((activity) => (
          <div key={activity.id} className="border-b p-4">
            <p className="text-sm">{activity.message}</p>

            <span className="text-xs text-zinc-500">
              {new Date(activity.createdAt).toLocaleString()}
            </span>
          </div>
        ))}

        {hasNextPage && (
          <div className="p-4">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="w-full rounded-lg border px-4 py-2"
            >
              {isFetchingNextPage ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
