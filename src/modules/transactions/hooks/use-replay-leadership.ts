"use client";

import { useEffect, useState } from "react";

import {
  becomeReplayLeader,
  canBecomeReplayLeader,
  clearReplayLeader,
  isReplayLeader,
  startReplayHeartbeat,
} from "../transport/replay/replay-leader";

export const useReplayLeadership = () => {
  const [leader] = useState(() => {
    if (globalThis.window === undefined) {
      return false;
    }

    if (canBecomeReplayLeader()) {
      becomeReplayLeader();
    }

    return isReplayLeader();
  });

  useEffect(() => {
    const stopHeartbeat = startReplayHeartbeat();

    const handleBeforeUnload = () => {
      clearReplayLeader();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      stopHeartbeat();

      window.removeEventListener("beforeunload", handleBeforeUnload);

      clearReplayLeader();
    };
  }, []);

  return {
    isLeader: leader,
  };
};
