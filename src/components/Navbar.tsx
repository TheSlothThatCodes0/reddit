"use client";

import Link from 'next/link';
import { Search } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="h-16 bg-zinc-900 text-white fixed top-0 left-0 right-0 z-50 border-b border-gray-700">
      <div className="container mx-auto h-full flex items-center justify-between px-4 ">
        <div className="flex-shrink-0">
          <Link href="/" className="flex items-center">
            <span className="text-orange-500 font-bold text-2xl">reddit</span>
          </Link>
        </div>

        <div className="w-[35%]">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Reddit"
              className="w-full py-2 pl-10 pr-4 rounded-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>

        <div className="flex items-center space-x-4 flex-shrink-0">
          <button className="px-4 py-1 text-sm font-medium text-orange-600 border border-ornage-600 rounded-full hover:bg-blue-50 dark:hover:bg-gray-700">
            Log In
          </button>
          <button className="px-4 py-1 text-sm font-medium text-white bg-orange-600 rounded-full hover:bg-orange-700">
            Sign Up
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;