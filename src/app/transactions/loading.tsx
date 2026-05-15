export default function Loading() {
  return (
    <div className="space-y-2 p-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className=" h-12 animate-pulse rounded  bg-gray-200" />
      ))}
    </div>
  );
}
