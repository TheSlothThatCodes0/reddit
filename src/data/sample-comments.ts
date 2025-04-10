import { Comment } from '@/types/comment';

export const SAMPLE_COMMENTS: Comment[] = [
  {
    id: 'comment1',
    postId: 'post1',
    content: 'The fact that honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly good to eat.',
    authorName: 'history_nerd',
    upvotes: 423,
    timePosted: '4 hours ago'
  },
  {
    id: 'comment2',
    postId: 'post1',
    content: "That there are more possible iterations of a game of chess than there are atoms in the observable universe. It's called the Shannon number.",
    authorName: 'chess_master',
    upvotes: 317,
    timePosted: '3 hours ago'
  },
  {
    id: 'comment3',
    postId: 'post2',
    content: 'This is great news! Curious about the cost though. New technologies tend to be prohibitively expensive at first. Anyone know the projected cost per kilowatt?',
    authorName: 'practical_engineer',
    upvotes: 89,
    timePosted: '6 hours ago'
  },
  {
    id: 'comment4',
    postId: 'post2',
    content: 'As someone who works in the renewable energy sector, this is exciting but we should be cautious about claims of 37% improvement. Need to see more peer-reviewed data.',
    authorName: 'energy_expert',
    upvotes: 142,
    timePosted: '5 hours ago'
  },
  {
    id: 'comment5',
    postId: 'post3',
    content: "Moon (2009) with Sam Rockwell. Brilliant sci-fi that explores isolation and what it means to be human. Rockwell's performance is incredible.",
    authorName: 'sci_fi_fan',
    upvotes: 76,
    timePosted: '10 hours ago'
  },
  {
    id: 'comment6',
    postId: 'post3',
    content: "The Secret Life of Walter Mitty (2013) doesn't get enough love. Beautiful cinematography, great story about breaking out of your comfort zone.",
    authorName: 'travel_lover',
    upvotes: 53,
    timePosted: '9 hours ago'
  }
];
