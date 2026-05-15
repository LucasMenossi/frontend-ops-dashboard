"use client";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function ErrorComponent({ error, reset }: Readonly<ErrorProps>) {
  return (
    <div className="p-6">
      <p>Failed to load transactions</p>
      <p>{error.message}</p>
      <button onClick={reset}>Retry</button>
    </div>
  );
}
