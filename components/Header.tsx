
import React from 'react';
import { PlusIcon } from './icons/PlusIcon';

interface HeaderProps {
  onAddEvent: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAddEvent }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
            الأجندة الإلكترونية
          </h1>
          <button
            onClick={onAddEvent}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-transform transform hover:scale-105"
          >
            <PlusIcon className="w-5 h-5" />
            <span>أضف حدثًا</span>
          </button>
        </div>
      </div>
    </header>
  );
};
