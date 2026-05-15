const LEADER_KEY = "transactions-replay-leader";

const HEARTBEAT_INTERVAL = 2000;

const LEADER_TIMEOUT = 5000;

const TAB_ID =
  typeof crypto === "undefined"
    ? Math.random().toString(36)
    : crypto.randomUUID();

interface ReplayLeader {
  tabId: string;
  heartbeatAt: number;
}

const isBrowser = typeof window !== "undefined";

export const getReplayLeader = (): ReplayLeader | null => {
  if (!isBrowser) {
    return null;
  }

  const raw = localStorage.getItem(LEADER_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const becomeReplayLeader = () => {
  if (!isBrowser) {
    return;
  }

  const leader: ReplayLeader = {
    tabId: TAB_ID,
    heartbeatAt: Date.now(),
  };

  localStorage.setItem(LEADER_KEY, JSON.stringify(leader));
};

export const clearReplayLeader = () => {
  if (!isBrowser) {
    return;
  }

  const leader = getReplayLeader();

  if (!leader) {
    return;
  }

  if (leader.tabId !== TAB_ID) {
    return;
  }

  localStorage.removeItem(LEADER_KEY);
};

export const isReplayLeader = () => {
  const leader = getReplayLeader();

  if (!leader) {
    return false;
  }

  return leader.tabId === TAB_ID;
};

export const canBecomeReplayLeader = () => {
  const leader = getReplayLeader();

  if (!leader) {
    return true;
  }

  const now = Date.now();
  const isExpired = now - leader.heartbeatAt > LEADER_TIMEOUT;

  return isExpired;
};

export const startReplayHeartbeat = () => {
  if (!isBrowser) {
    return () => {};
  }

  const interval = setInterval(() => {
    if (!isReplayLeader()) {
      return;
    }

    becomeReplayLeader();
  }, HEARTBEAT_INTERVAL);

  return () => {
    clearInterval(interval);
  };
};
