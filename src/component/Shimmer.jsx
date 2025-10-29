import { CardSkeleton } from "./Skeletons";

const Shimmer = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 p-4 bg-[#FFF8E1]">
      {Array.from({ length: 12 }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
};
export default Shimmer;
