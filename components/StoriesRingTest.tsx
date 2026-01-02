import React from 'react';

const StoriesRingTest: React.FC = () => {
  return (
    <div className="flex gap-4 p-4 overflow-x-auto">
      <div className="flex-shrink-0 text-center">
        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
          <span className="text-blue-500 text-2xl">✅</span>
        </div>
        <p className="text-xs text-blue-600 mt-2 font-medium">Test OK</p>
      </div>
    </div>
  );
};

export default StoriesRingTest;