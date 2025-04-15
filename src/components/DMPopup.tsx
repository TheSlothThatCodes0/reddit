"use client";

import { useState, useEffect, useRef } from 'react';
import { X, Send } from 'lucide-react';
import { sendDirectMessage, getUserIdByUsername, DirectMessage } from '@/lib/supabase/api';

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
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load initial messages with proper error handling
  useEffect(() => {
    if (!isOpen) return;
    
    let isMounted = true;
    setIsLoading(true);
    
    // Simulate API delay for now - in a real implementation, fetch from database
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        setMessages([]);
        setIsLoading(false);
      }
    }, 700);
    
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [recipient.username, currentUser.username, isOpen]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    setIsSending(true);
    setError(null);
    
    // Store message text to use in optimistic UI update
    const currentMessageText = message.trim();
    
    // Clear input field immediately for better UX
    setMessage('');
    
    // Create temporary message object for UI
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage = {
      tempId: tempId,
      content: currentMessageText,
      read: true, // It's read since current user is sending it
      sentAt: 'Just now',
      senderID: 1, // Assuming currentUser ID is 1
      receiverID: 0, // Will be determined by API
      senderName: currentUser.username
    };
    
    // Add optimistic message to UI
    setMessages(prev => [...prev, optimisticMessage]);
    
    try {
      // Send the message
      const { success, error, messageId } = await sendDirectMessage(
        currentMessageText,
        recipient.username,
        1 // Assuming currentUser ID is 1
      );
      
      if (!success) {
        setError(error || "Failed to send message");
        console.error("Failed to send message:", error);
        
        // Remove the optimistic message on failure
        setMessages(prev => prev.filter(msg => msg.tempId !== tempId));
      } else {
        // Update the temporary message with the real message ID and correct timestamp
        setMessages(prev => prev.map(msg => 
          msg.tempId === tempId 
            ? { ...msg, messageID: messageId, tempId: undefined, sentAt: 'Just now' } 
            : msg
        ));
      }
    } catch (err: any) {
      setError(err.message || "Failed to send message");
      console.error("Exception sending message:", err);
      
      // Remove the optimistic message on error
      setMessages(prev => prev.filter(msg => msg.tempId !== tempId));
    } finally {
      setIsSending(false);
    }
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
    <div className="fixed right-4 bottom-4 w-96 rounded-lg shadow-lg flex flex-col bg-white dark:bg-gray-800 z-50" style={{ height: '400px' }}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
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
            {messages.map((msg, index) => (
              <div 
                key={msg.tempId || msg.messageID || `msg-${index}`}
                className={`flex ${msg.senderName === currentUser.username ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[70%] rounded-lg px-3 py-2 ${
                    msg.senderName === currentUser.username 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <p className={`text-xs mt-1 ${
                      msg.senderName === currentUser.username 
                        ? 'text-blue-100' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {msg.sentAt}
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
        {error && (
          <div className="mb-2 text-red-500 text-sm">{error}</div>
        )}
        <div className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Send a message..."
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-l-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !isSending) handleSendMessage();
            }}
            disabled={isSending}
          />
          <button 
            onClick={handleSendMessage}
            disabled={isSending || !message.trim()}
            className={`bg-blue-500 hover:bg-blue-600 text-white rounded-r-lg px-4 py-2 flex items-center ${
              isSending || !message.trim() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DMPopup;
