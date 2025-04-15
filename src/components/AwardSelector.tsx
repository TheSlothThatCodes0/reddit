import { useState } from 'react';
import { X } from 'lucide-react';
import AwardIcon from './AwardIcon';
import { giveAward, AwardType } from '@/lib/supabase/api';

type AwardSelectorProps = {
  postId: string;
  isOpen: boolean;
  onClose: () => void;
  onAwardGiven: (awardType: AwardType) => void;
};

type AwardOption = {
  type: AwardType;
  name: string;
  description: string;
  price: number;
};

const awards: AwardOption[] = [
  { 
    type: 'bronze', 
    name: 'Bronze Award', 
    description: 'A simple show of recognition',
    price: 50
  },
  { 
    type: 'silver', 
    name: 'Silver Award', 
    description: 'Shows appreciation for quality content',
    price: 100
  },
  { 
    type: 'gold', 
    name: 'Gold Award', 
    description: 'Highlights exceptional content',
    price: 250
  },
  { 
    type: 'diamond', 
    name: 'Diamond Award', 
    description: 'The highest honor for truly remarkable content',
    price: 500
  }
];

const AwardSelector = ({ postId, isOpen, onClose, onAwardGiven }: AwardSelectorProps) => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  if (!isOpen) return null;
  
  const handleAwardClick = async (award: AwardOption) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const { success, error } = await giveAward(
        award.type, 
        postId, 
        undefined, // Not a comment
        message
      );
      
      if (success) {
        onAwardGiven(award.type);
        onClose();
      } else {
        setError(error || "Failed to give award. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-lg w-full mx-4">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold dark:text-gray-200">Give an Award</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-900 rounded-md text-red-600 dark:text-red-400">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            {awards.map((award) => (
              <button
                key={award.type}
                onClick={() => handleAwardClick(award)}
                disabled={isSubmitting}
                className={`w-full flex items-center p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors dark:border-gray-700 cursor-pointer ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 mr-3">
                  <AwardIcon type={award.type} size={24} />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-medium dark:text-gray-200">{award.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{award.description}</p>
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-medium">
                  {award.price} karma
                </div>
              </button>
            ))}
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Add a message (optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isSubmitting}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Say something nice..."
              rows={2}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AwardSelector;
