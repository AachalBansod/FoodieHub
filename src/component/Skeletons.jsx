// Reusable skeleton placeholders using TailwindCSS
// Keep them simple and fast to render

export const CardSkeleton = () => (
  <div className="relative h-96 w-56 p-2 m-2 rounded-md bg-white shadow-sm animate-pulse">
    {/* Heart placeholder */}
    <div className="absolute right-2 top-2 h-6 w-6 rounded-full bg-gray-200" />
    <div className="h-40 w-full rounded-md bg-gray-200" />
    <div className="mt-3 h-5 w-3/4 rounded bg-gray-200" />
    <div className="mt-2 h-4 w-1/2 rounded bg-gray-200" />
    <div className="mt-2 h-4 w-2/3 rounded bg-gray-200" />
  </div>
);

export const SearchBarSkeleton = () => (
  <div className="p-5 bg-orange-200 my-4 animate-pulse">
    <div className="h-10 w-80 rounded bg-orange-100" />
  </div>
);

export const MenuSkeleton = () => (
  <div className="flex flex-col gap-6 p-4">
    {/* Restaurant header */}
    <div className="flex gap-4">
      <div className="h-64 w-64 rounded bg-gray-200 animate-pulse" />
      <div className="flex-1">
        <div className="h-6 w-2/3 rounded bg-gray-200 animate-pulse" />
        <div className="mt-2 h-5 w-1/4 rounded bg-gray-200 animate-pulse" />
        <div className="mt-2 h-5 w-1/3 rounded bg-gray-200 animate-pulse" />
      </div>
    </div>
    {/* Menu items */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex items-start gap-4 p-3 rounded-md bg-white shadow-sm"
        >
          <div className="h-24 w-24 rounded bg-gray-200 animate-pulse" />
          <div className="flex-1">
            <div className="h-5 w-2/3 rounded bg-gray-200 animate-pulse" />
            <div className="mt-2 h-4 w-3/4 rounded bg-gray-200 animate-pulse" />
            <div className="mt-3 h-5 w-24 rounded bg-gray-200 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default CardSkeleton;
