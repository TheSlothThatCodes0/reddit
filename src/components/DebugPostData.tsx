"use client";

import { useState } from 'react';

interface DebugPostDataProps {
  post: any;
}

export default function DebugPostData({ post }: DebugPostDataProps) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="rounded-md p-2 my-2 bg-gray-100 dark:bg-gray-800 text-xs">
      <button 
        onClick={() => setExpanded(!expanded)}
        className="text-blue-600 dark:text-blue-400 font-medium"
      >
        {expanded ? "Hide" : "Show"} Debug Data
      </button>
      
      {expanded && (
        <pre className="mt-2 overflow-auto max-h-60 p-2 bg-gray-200 dark:bg-gray-900 rounded">
          {JSON.stringify(post, null, 2)}
        </pre>
      )}
    </div>
  );
}
