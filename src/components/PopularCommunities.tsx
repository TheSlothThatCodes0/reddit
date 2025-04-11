"use client";

import Link from 'next/link';

const TOP_COMMUNITIES = [
  { name: 'AskReddit', members: '42.1m', id: 'askreddit' },
  { name: 'funny', members: '38.6m', id: 'funny' },
  { name: 'gaming', members: '36.9m', id: 'gaming' },
  { name: 'pics', members: '30.2m', id: 'pics' },
  { name: 'worldnews', members: '31.5m', id: 'worldnews' }
];

const PopularCommunities = () => {
  return (
    <aside className="w-80 fixed top-28 right-18 bottom-0 overflow-y-auto">
      <div className="p-4">
        <div className="bg-white dark:bg-[#121212] rounded-lg shadow">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              Popular Communities
            </h2>
          </div>
          <div className="p-2">
            {TOP_COMMUNITIES.map((community) => (
              <Link 
                href={`/r/${community.id}`}
                key={community.id}
                className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
              >
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-orange-600 mr-2"></div>
                  <span className="text-sm font-medium">r/{community.name}</span>
                </div>
                <span className="text-xs text-gray-500">{community.members}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default PopularCommunities;
