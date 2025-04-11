"use client";

import { useState, useEffect, useRef } from 'react';
import { X, Send, Paperclip } from 'lucide-react';
import Image from 'next/image';

type Message = {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  timestamp: string;
  isRead: boolean;
};

type DMPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  recipient: {
    username: string;
    avatarColor?: string;
  };
  currentUser: {
    username: string;
    avatarColor?: string;
  };
};

const DMPopup = ({ isOpen, onClose, recipient, currentUser }: DMPopupProps) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sample initial messages (in a real app, fetch from API)
  useEffect(() => {
    // Simulate loading messages
    setIsLoading(true);
    setTimeout(() => {
      if (recipient.username === 'green_tech') {
        setMessages([
          {
            id: '1',
            content: "Hi there! I read your post about renewable energy. That's fascinating research!",
            senderId: currentUser.username,
            receiverId: recipient.username,
            timestamp: '2 days ago',
            isRead: true
          },
          {
            id: '2',
            content: "Thanks for reaching out! Yes, the new solar panel technology has been showing great results in our tests.",
            senderId: recipient.username,
            receiverId: currentUser.username,
            timestamp: '2 days ago',
            isRead: true
          },
          {
            id: '3',
            content: "Would you be willing to share any more details about the efficiency improvements?",
            senderId: currentUser.username,
            receiverId: recipient.username,
            timestamp: '1 day ago',
            isRead: true
          }
        ]);
      } else if (recipient.username === 'film_buff') {
        setMessages([
          {
            id: '1',
            content: "Hey, I saw your comment about underrated movies. Have you watched 'The Secret Life of Walter Mitty'?",
            senderId: currentUser.username,
            receiverId: recipient.username,
            timestamp: '3 days ago',
            isRead: true
          }
        ]);
      }
      setIsLoading(false);
    }, 700);
  }, [recipient.username, currentUser.username]);

  // Scroll to bottom of messages when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // In a real app, send to API
    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      senderId: currentUser.username,
      receiverId: recipient.username,
      timestamp: 'Just now',
      isRead: false
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
  };

  // Function to get avatar color as hex
  const getAvatarColor = (color?: string): string => {
    switch (color) {
      case 'red': return '#EF4444';
      case 'orange': return '#F97316';
      case 'yellow': return '#EAB308';
      case 'green': return '#22C55E';
      case 'blue': return '#3B82F6';
      case 'purple': return '#A855F7';
      default: return '#3B82F6'; // Default blue
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md h-[500px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-2"
              style={{ backgroundColor: getAvatarColor(recipient.avatarColor) }}
            >
              {recipient.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">u/{recipient.username}</h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages area */}
        <div className="flex-1 p-4 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : messages.length > 0 ? (
            <div className="space-y-3">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.senderId === currentUser.username ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[70%] rounded-lg px-3 py-2 ${
                      msg.senderId === currentUser.username 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    <p className={`text-xs mt-1 ${
                        msg.senderId === currentUser.username 
                          ? 'text-blue-100' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center">
              <p className="mb-2">No messages yet</p>
              <p className="text-sm">Send a message to start the conversation</p>
            </div>
          )}
        </div>

        {/* Message input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Send a message..."
              className="flex-1 border border-gray-300 dark:border-gray-600 rounded-l-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
            />
            <button 
              onClick={handleSendMessage}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-r-lg px-4 py-2 flex items-center"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DMPopup;
