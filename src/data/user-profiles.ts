import { UserProfile } from '@/types/user-profile';

export const USER_PROFILES: UserProfile[] = [
  {
    username: 'curious_mind',
    avatarColor: 'orange',
    bannerColor: 'linear-gradient(90deg, #FF8008 0%, #FFC837 100%)',
    bio: 'Always learning and sharing interesting facts. I love science, history, and technology. Feel free to message me if you want to chat about anything interesting!',
    karma: 12458,
    joinDate: 'September 15, 2020',
    location: 'San Francisco, CA',
    isVerified: true
  },
  {
    username: 'green_tech',
    avatarColor: 'green',
    bannerColor: 'linear-gradient(90deg, #1D976C 0%, #93F9B9 100%)',
    bio: 'Environmental engineer working on renewable energy solutions. Passionate about sustainability and reducing carbon footprints.',
    karma: 8732,
    joinDate: 'March 22, 2019',
    location: 'Boston, MA'
  },
  {
    username: 'film_buff',
    avatarColor: 'purple',
    bannerColor: 'linear-gradient(90deg, #834D9B 0%, #D04ED6 100%)',
    bio: 'Cinema enthusiast. I watch at least one movie every day. My favorite directors are Christopher Nolan, Denis Villeneuve, and Wes Anderson.',
    karma: 5421,
    joinDate: 'July 11, 2021'
  },
  {
    username: 'history_nerd',
    avatarColor: 'red',
    bannerColor: 'linear-gradient(90deg, #8E0E00 0%, #1F1C18 100%)',
    bio: 'Ancient history doctoral student. Specializing in Mediterranean civilizations and archaeology.',
    karma: 15689,
    joinDate: 'February 3, 2018',
    location: 'Chicago, IL'
  },
  {
    username: 'chess_master',
    avatarColor: 'blue',
    bannerColor: 'linear-gradient(90deg, #0F2027 0%, #203A43 50%, #2C5364 100%)',
    bio: 'Chess enthusiast with a FIDE rating of 2150. Open to friendly matches anytime!',
    karma: 9234,
    joinDate: 'November 28, 2019',
    location: 'Toronto, Canada'
  }
];
