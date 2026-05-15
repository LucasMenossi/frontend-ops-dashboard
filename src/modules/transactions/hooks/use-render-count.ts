"use client";

import { useEffect, useRef } from "react";

export const useRenderCount = (name: string) => {
  const count = useRef(0);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      return;
    }

    count.current += 1;

    console.log(`${name}: ${count.current}`);
  }, [name]);
};
