export default function Loading() {
  return (
    <div className="animate-pulse p-4 max-w-xl mx-auto">
      {/* Card */}
      <div className="bg-[#1e1e2f] rounded-3xl border border-[#2a2a3b] overflow-hidden shadow-sm">

        {/* Preview Section */}
        <div className="bg-[#2b2b3d] p-6 flex justify-center items-center">
          <div className="w-48 h-96 bg-[#121212] rounded-[2rem] relative">
            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-700 rounded-full"></div>
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-700 rounded-full"></div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-4">
          {/* Title */}
          <div className="h-5 bg-gray-700 rounded w-3/4"></div>
          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
          </div>

          {/* Author */}
          <div className="flex items-center gap-3 mt-4">
            <div className="w-8 h-8 bg-gray-600 rounded-full" />
            <div className="space-y-1">
              <div className="h-3 w-24 bg-gray-700 rounded"></div>
              <div className="h-2 w-20 bg-gray-600 rounded"></div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex gap-2 flex-wrap mt-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-6 w-16 bg-gray-700 rounded-full" />
            ))}
          </div>

          {/* Stats and Button */}
          <div className="flex justify-between items-center border-t border-[#2f2f45] pt-4 mt-4">
            <div className="flex gap-4">
              <div className="h-4 w-10 bg-gray-700 rounded"></div>
              <div className="h-4 w-10 bg-gray-700 rounded"></div>
            </div>
            <div className="h-8 w-24 bg-blue-700 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
