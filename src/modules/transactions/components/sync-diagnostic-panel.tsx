"use client";

import { useSyncDiagnostics } from "../hooks/use-sync-diagnostics";

export const SyncDiagnosticsPanel = () => {
  const diagnostics = useSyncDiagnostics();

  return (
    <div className=" rounded-xl border  bg-white p-4 shadow-sm">
      <div className=" mb-4 flex items-center justify-between">
        <h2 className=" text-lg font-semibold">Sync Diagnostics</h2>
      </div>

      <div className=" grid grid-cols-2 gap-3 md:grid-cols-4">
        <DiagnosticCard
          label="Optimistic"
          value={diagnostics.optimisticCount}
        />

        <DiagnosticCard label="Replaying" value={diagnostics.replayingCount} />

        <DiagnosticCard
          label="Conflicted"
          value={diagnostics.conflictedCount}
        />

        <DiagnosticCard label="Dirty" value={diagnostics.dirtyCount} />
      </div>
    </div>
  );
};

interface DiagnosticCardProps {
  label: string;
  value: number;
}

const DiagnosticCard = ({ label, value }: DiagnosticCardProps) => {
  return (
    <div className=" rounded-lg border  bg-zinc-50 p-3">
      <div className="text-sm text-zinc-500">{label}</div>

      <div className=" mt-2 text-2xl font-bold">{value}</div>
    </div>
  );
};
