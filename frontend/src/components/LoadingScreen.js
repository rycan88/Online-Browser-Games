import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-black to-black via-sky-900">
      <div className="flex flex-col items-center">
        {/* Spinning Circle */}
        <div className="animate-spin rounded-full h-[32px] w-[32px] border-t-4 border-white"></div>
        {/* Loading Text */}
        <h1 className="text-white text-2xl mt-6 font-semibold">
          Loading...
        </h1>
      </div>
    </div>
  );
};

export default LoadingScreen;