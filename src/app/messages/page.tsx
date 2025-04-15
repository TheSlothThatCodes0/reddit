"use client";

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { Send, Search } from 'lucide-react';
import { USER_PROFILES } from '@/data/user-profiles';
import { 
  getUserConversations, 
  getConversationMessages, 
  sendDirectMessage, 
  getUserIdByUsername,
  DirectMessage,
  ConversationSummary
} from '@/lib/supabase/api';

// Extended DirectMessage type with tempId for optimistic updates
interface ExtendedDirectMessage extends DirectMessage {
  tempId?: string;
}

export default function MessagesPage() {
  const searchParams = useSearchParams();
  const userFromURL = searchParams.get('user');
  
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(userFromURL);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ExtendedDirectMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Current user info - in a real app this would come from auth
  const currentUser = "QuirkyPanda42";
  const currentUserId = 1; // Assuming user ID 1 is QuirkyPanda42
  
  // Load conversations on mount - with error handling and cleanup
  useEffect(() => {
    let isMounted = true;
    async function loadConversations() {
      setIsLoadingConversations(true);
      
      try {
        const { conversations, error } = await getUserConversations(currentUserId);
        
        if (error) {
          console.error("Error loading conversations:", error);
          if (isMounted) setError(`Failed to load conversations: ${error}`);
        } else {
          if (isMounted) setConversations(conversations || []);
        }
      } catch (err) {
        console.error("Exception loading conversations:", err);
        if (isMounted) setError("An unexpected error occurred");
      } finally {
        if (isMounted) setIsLoadingConversations(false);
      }
    }
    
    loadConversations();
    
    // Cleanup function to prevent state updates if component unmounts
    return () => {
      isMounted = false;
    };
  }, [currentUserId]);
  
  // If user is provided in URL, fetch their ID
  useEffect(() => {
    let isMounted = true;
    
    async function loadInitialUser() {
      if (userFromURL) {
        try {
          const { userId, error } = await getUserIdByUsername(userFromURL);
          
          if (!error && userId && isMounted) {
            setSelectedUser(userFromURL);
            setSelectedUserId(userId);
          }
        } catch (err) {
          console.error("Error finding user:", err);
        }
      }
    }
    
    loadInitialUser();
    
    return () => {
      isMounted = false;
    };
  }, [userFromURL]);
  
  // Load messages when a user is selected - add proper error handling
  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout | null = null;
    
    async function loadMessages() {
      if (!selectedUser || !selectedUserId) return;
      
      setIsLoadingMessages(true);
      setError(null);
      
      try {
        const { messages, error } = await getConversationMessages(
          currentUserId, 
          selectedUserId
        );
        
        if (error) {
          console.error("Error loading messages:", error);
          if (isMounted) setError(`Failed to load messages: ${error}`);
        } else {
          if (isMounted) setMessages(messages || []);
        }
      } catch (err) {
        console.error("Exception loading messages:", err);
        if (isMounted) setError("An unexpected error occurred");
      } finally {
        if (isMounted) setIsLoadingMessages(false);
      }
    }
    
    loadMessages();
    
    // Set up polling with proper cleanup
    if (selectedUser && selectedUserId) {
      // Using a timeout instead of interval for more control
      const setupNextPoll = () => {
        timeoutId = setTimeout(() => {
          loadMessages();
          if (isMounted) setupNextPoll();
        }, 5000);
      };
      
      setupNextPoll();
    }
    
    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [selectedUser, selectedUserId, currentUserId]);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;
    
    setIsSending(true);
    const messageText = newMessage.trim();
    setNewMessage('');
    setError(null);
    
    // Create optimistic update with temporary ID
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: ExtendedDirectMessage = {
      tempId,
      content: messageText,
      read: true,
      sentAt: 'Just now',
      senderID: currentUserId,
      receiverID: selectedUserId || 0,
      senderName: currentUser
    };
    
    setMessages([...messages, optimisticMessage]);
    
    try {
      const { success, error, messageId } = await sendDirectMessage(
        messageText, 
        selectedUser,
        currentUserId
      );
      
      if (!success) {
        console.error("Failed to send message:", error);
        setError(`Failed to send message: ${error}`);
        // Remove the optimistic message
        setMessages(msgs => msgs.filter(m => m.tempId !== tempId));
      } else {
        // Update the temporary message with the real message ID
        setMessages(msgs => msgs.map(m => {
          if ('tempId' in m && m.tempId === tempId) {
            // Create a new object without the tempId property
            const { tempId, ...rest } = m;
            return { ...rest, messageID: messageId };
          }
          return m;
        }));
      }
    } catch (err: any) {
      console.error("Exception sending message:", err);
      setError("An unexpected error occurred");
      // Remove the optimistic message
      setMessages(msgs => msgs.filter(m => 'tempId' in m ? m.tempId !== tempId : true));
    } finally {
      setIsSending(false);
    }
  };
  
  const handleSelectUser = async (conversation: ConversationSummary) => {
    setSelectedUser(conversation.username);
    setSelectedUserId(conversation.userId);
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

  // Get selected user profile
  const selectedUserProfile = conversations.find(conv => conv.username === selectedUser);

  return (
    <div className="fixed inset-0 flex overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col pl-64 pt-16">
        <div className="flex flex-1 overflow-hidden h-[calc(100vh-64px)]">
          {/* Conversations List */}
          <div className="w-72 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Messages</h2>
              <div className="relative">
                <input
                  type="text" 
                  placeholder="Search messages"
                  className="w-full py-2 pl-10 pr-4 rounded-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              </div>
            </div>
            
            {/* Conversations list - scrollable */}
            <div className="flex-1 overflow-y-auto">
              {isLoadingConversations ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : conversations.length > 0 ? (
                <div>
                  {conversations.map((conv) => (
                    <button
                      key={conv.userId}
                      className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-800 relative ${
                        selectedUser === conv.username ? 'bg-gray-100 dark:bg-gray-800' : ''
                      }`}
                      onClick={() => handleSelectUser(conv)}
                    >
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-3 flex-shrink-0"
                        style={{ backgroundColor: getAvatarColor(conv.avatarColor) }}
                      >
                        {conv.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-medium text-gray-900 dark:text-white truncate">u/{conv.username}</h3>
                          <span className="text-xs text-gray-500">{conv.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {conv.latestMessage}
                        </p>
                      </div>
                      {conv.unreadCount > 0 && (
                        <div className="ml-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0">
                          {conv.unreadCount}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-4 text-gray-500">
                  <p className="text-center">No conversations yet</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Messages Area */}
          <div className="flex-1 flex flex-col h-full">
            {selectedUser ? (
              <>
                {/* Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-3"
                    style={{ backgroundColor: getAvatarColor(selectedUserProfile?.avatarColor) }}
                  >
                    {selectedUser.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">u/{selectedUser}</h3>
                  </div>
                </div>
                
                {/* Messages - scrollable */}
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
                  {isLoadingMessages ? (
                    <div className="flex justify-center items-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  ) : error ? (
                    <div className="flex justify-center items-center h-full text-red-500">
                      <p>{error}</p>
                    </div>
                  ) : messages.length > 0 ? (
                    <div className="space-y-3">
                      {messages.map((msg, index) => (
                        <div 
                          key={('tempId' in msg && msg.tempId) || msg.messageID || `msg-${index}`}
                          className={`flex ${msg.senderID === currentUserId ? 'justify-end' : 'justify-start'}`}
                        >
                          <div 
                            className={`max-w-[70%] rounded-lg px-4 py-2 ${
                              msg.senderID === currentUserId 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
                            }`}
                          >
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                            <p className={`text-xs mt-1 ${
                                msg.senderID === currentUserId 
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
                
                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Send a message..."
                      className="flex-1 border border-gray-300 dark:border-gray-600 rounded-l-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !isSending) handleSendMessage();
                      }}
                      disabled={isSending}
                    />
                    <button 
                      onClick={handleSendMessage}
                      className={`bg-blue-500 hover:bg-blue-600 text-white rounded-r-lg px-4 py-2 flex items-center ${
                        isSending || !newMessage.trim() ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      disabled={isSending || !newMessage.trim()}
                    >
                      <Send size={18} />
                    </button>
                  </div>
                  {error && (
                    <p className="mt-2 text-sm text-red-500">{error}</p>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full bg-gray-50 dark:bg-gray-900 text-gray-500">
                <p className="text-center text-lg mb-2">Select a conversation</p>
                <p className="text-center text-sm">Choose from your existing messages or start a new conversation</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
