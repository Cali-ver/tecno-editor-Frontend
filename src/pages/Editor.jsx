import React from 'react';
import Navbar from '../components/Navbar';

const Editor = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-col items-center justify-center py-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to the Editor!</h1>
        <p className="text-gray-600 text-lg">
          This is where the magic happens. Start creating your masterpiece today.
        </p>
      </div>
    </div>
  );
};

export default Editor;
