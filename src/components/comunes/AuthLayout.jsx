import React from 'react';

export default function AuthLayout({ title, children }) {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-96">
        <h2 className="text-2xl font-bold text-center text-pink-500 mb-6">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}