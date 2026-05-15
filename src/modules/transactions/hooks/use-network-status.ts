"use client";

import { useEffect, useState } from "react";

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(() => {
    if (globalThis.window === undefined) {
      return true;
    }

    return globalThis.navigator.onLine;
  });

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    globalThis.addEventListener("online", handleOnline);

    globalThis.addEventListener("offline", handleOffline);

    return () => {
      globalThis.removeEventListener("online", handleOnline);

      globalThis.removeEventListener("offline", handleOffline);
    };
  }, []);

  return {
    isOnline,
  };
};
