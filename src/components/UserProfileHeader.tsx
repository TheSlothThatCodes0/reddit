"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarDays, Cake, Mail, Edit, MapPin } from 'lucide-react';
import { UserProfile } from '@/types/user-profile';
import DMPopup from './DMPopup';

type UserProfileHeaderProps = {
  user: UserProfile;
  isCurrentUser: boolean;
};

const UserProfileHeader = ({ user, isCurrentUser }: UserProfileHeaderProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [bioText, setBioText] = useState(user.bio || '');
  const [isDMOpen, setIsDMOpen] = useState(false);

  const handleSaveBio = () => {
    // In a real app, send this to an API
    setIsEditing(false);
    console.log("Bio saved:", bioText);
  };

  const handleMessageUser = () => {
    router.push(`/messages?user=${user.username}`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 mb-6 shadow-sm">
      {/* Banner */}
      <div 
        className="h-32 w-full bg-gradient-to-r from-blue-400 to-purple-500"
        style={user.bannerColor ? { background: user.bannerColor } : {}}
      />
      
      {/* User info section */}
      <div className="mx-auto max-w-4xl px-4 pb-4 relative">
        {/* Avatar - positioned to be half in banner, half below */}
        <div className="absolute -top-16 left-4">
          <div 
            className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center text-white text-4xl font-bold"
            style={{ backgroundColor: getAvatarColor(user.avatarColor) }}
          >
            {user.username.charAt(0).toUpperCase()}
          </div>
        </div>
        
        {/* User details - placed to the right of avatar */}
        <div className="flex justify-between items-start pl-40 pt-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              u/{user.username}
            </h1>
            
            <div className="flex items-center text-sm text-gray-500 mt-1 flex-wrap gap-3">
              <div className="flex items-center">
                <Cake size={16} className="mr-1" />
                <span>Cake day: {user.joinDate}</span>
              </div>
              
              {user.location && (
                <div className="flex items-center">
                  <MapPin size={16} className="mr-1" />
                  <span>{user.location}</span>
                </div>
              )}
              
              <div className="flex items-center">
                <CalendarDays size={16} className="mr-1" />
                <span>{user.karma} karma</span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            {!isCurrentUser && (
              <button 
                onClick={handleMessageUser}
                className="px-4 py-1 text-sm font-medium rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                <Mail size={16} className="inline mr-1" />
                Message
              </button>
            )}
            
            {isCurrentUser && !isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="px-4 py-1 text-sm font-medium rounded-full bg-gray-600 text-white hover:bg-blue-600"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
        
        {/* Bio section - spans full width below avatar and details */}
        <div className="mt-8 w-full">
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={bioText}
                onChange={(e) => setBioText(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 text-gray-800 dark:text-gray-200 dark:bg-gray-700"
                rows={3}
                placeholder="Tell us about yourself..."
              />
              <div className="flex justify-end space-x-2">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 text-sm font-medium rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveBio}
                  className="px-3 py-1 text-sm font-medium rounded-full bg-blue-500 text-white hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {user.bio || (isCurrentUser ? "Add a bio to tell the community about yourself!" : "This user hasn't added a bio yet.")}
            </p>
          )}
        </div>
      </div>

      {/* DM Popup */}
      <DMPopup 
        isOpen={isDMOpen} 
        onClose={() => setIsDMOpen(false)}
        recipient={user}
        currentUser={{ username: 'curious_mind', avatarColor: 'orange' }}
      />
    </div>
  );
};

// Function to get the appropriate avatar color
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

export default UserProfileHeader;
