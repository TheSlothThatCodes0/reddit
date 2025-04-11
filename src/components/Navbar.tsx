"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Search, Bell, MessageCircle, ChevronDown, User, Settings, LogOut, Moon, Sun, HelpCircle } from 'lucide-react';
import DMPopup from './DMPopup';

const Navbar = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [messagesMenuOpen, setMessagesMenuOpen] = useState(false);
  const [isDMOpen, setIsDMOpen] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState<any>(null);
  
  // Sample recent conversations (in a real app, fetch from API)
  const recentConversations = [
    { username: 'green_tech', avatarColor: 'green' },
    { username: 'film_buff', avatarColor: 'purple' }
  ];

  const openDM = (recipient: any) => {
    setSelectedRecipient(recipient);
    setIsDMOpen(true);
  };

  // Separate toggle functions to avoid interference between dropdowns
  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
    setMessagesMenuOpen(false); // Close messages menu when opening user menu
  };

  const toggleMessagesMenu = () => {
    setMessagesMenuOpen(!messagesMenuOpen);
    setUserMenuOpen(false); // Close user menu when opening messages menu
  };

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
          {/* User Section */}
        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <Bell size={20} className="text-gray-500" />
          </button>
          
          {/* Messages dropdown */}
          <div className="relative">
            <Link href="/messages">
              <button 
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <MessageCircle size={20} className="text-gray-500" />
              </button>
            </Link>
          </div>
          
          {/* User Avatar & Dropdown */}
          <div className="relative">
            <button 
              className="flex items-center space-x-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 p-1 px-2"
              onClick={toggleUserMenu}
            >
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                C
              </div>
              <div className="hidden md:flex items-center">
                <span className="text-sm font-medium mr-1">curious_mind</span>
                <ChevronDown size={16} />
              </div>
            </button>
            
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                <Link 
                  href="/user/curious_mind"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Link>
                <Link 
                  href="/settings"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
                <Link 
                  href="/help"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Help Center
                </Link>
                <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                <button 
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => {}}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>

      {/* DM Popup */}
      {selectedRecipient && (
        <DMPopup 
          isOpen={isDMOpen} 
          onClose={() => setIsDMOpen(false)}
          recipient={selectedRecipient}
          currentUser={{ username: 'curious_mind', avatarColor: 'orange' }}
        />
      )}
    </header>
  );
};

// Function to get avatar color (same as in UserProfileHeader)
function getAvatarColor(color: string | undefined): string {
  switch (color) {
    case 'red': return '#EF4444';
    case 'orange': return '#F97316';
    case 'yellow': return '#EAB308';
    case 'green': return '#22C55E';
    case 'blue': return '#3B82F6';
    case 'purple': return '#A855F7';
    default: return '#3B82F6'; // Default blue
  }
}

export default Navbar;