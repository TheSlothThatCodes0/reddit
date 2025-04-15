import { Award } from 'lucide-react';
import { AwardType } from '@/lib/supabase/api';

type AwardIconProps = {
  type: AwardType;
  size?: number;
  className?: string;
};

const AwardIcon = ({ type, size = 16, className = '' }: AwardIconProps) => {
  let color = '';
  
  switch (type) {
    case 'bronze':
      color = 'text-amber-600';
      break;
    case 'silver':
      color = 'text-gray-400';
      break;
    case 'gold':
      color = 'text-yellow-500';
      break;
    case 'diamond':
      color = 'text-blue-400';
      break;
    default:
      color = 'text-gray-500';
  }
  
  return (
    <Award 
      size={size} 
      className={`${color} ${className}`}
      aria-label={`${type} award`}
    />
  );
};

export default AwardIcon;
