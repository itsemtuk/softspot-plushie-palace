
import React, { useState } from 'react';

interface ProfileHeaderStatsProps {
  postsCount: number;
  followersCount: number;
  followingCount: number;
}

export function ProfileHeaderStats({ 
  postsCount, 
  followersCount, 
  followingCount 
}: ProfileHeaderStatsProps) {
  const [activeTab, setActiveTab] = useState<'posts' | 'collections' | 'sales'>('posts');

  return (
    <div className="flex justify-center mt-4 border-b border-gray-100">
      <div className="flex">
        <button 
          className={`text-center px-6 py-3 ${activeTab === 'posts' 
            ? 'border-b-2 border-softspot-500 text-softspot-500' 
            : 'hover:border-b-2 hover:border-softspot-300 cursor-pointer text-gray-500 hover:text-softspot-400'}`}
          onClick={() => setActiveTab('posts')}
        >
          <span className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Posts
          </span>
          <span className="block font-medium">{postsCount}</span>
        </button>
        
        <button 
          className={`text-center px-6 py-3 ${activeTab === 'collections' 
            ? 'border-b-2 border-softspot-500 text-softspot-500' 
            : 'hover:border-b-2 hover:border-softspot-300 cursor-pointer text-gray-500 hover:text-softspot-400'}`}
          onClick={() => setActiveTab('collections')}
        >
          <span className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Followers
          </span>
          <span className="block font-medium">{followersCount}</span>
        </button>
        
        <button 
          className={`text-center px-6 py-3 ${activeTab === 'sales' 
            ? 'border-b-2 border-softspot-500 text-softspot-500' 
            : 'hover:border-b-2 hover:border-softspot-300 cursor-pointer text-gray-500 hover:text-softspot-400'}`}
          onClick={() => setActiveTab('sales')}
        >
          <span className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Following
          </span>
          <span className="block font-medium">{followingCount}</span>
        </button>
      </div>
    </div>
  );
}
