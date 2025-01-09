import { useEffect, useState } from 'react';
import {
  Search,
  Plus,
  Settings,
  Globe,
  ChevronDown,
  Sun,
  Moon,
  Menu,
  ShareIcon,
  X,
  ThumbsUp,
  MessageSquare,
  MoreHorizontal,
  LayoutGrid,
  Hash,
} from 'lucide-react';
import FileUploader from '@/components/CreateContentModal';
import ShareBrain from '@/components/ShareBrain';
import { useNavigate, useParams } from 'react-router';
import UniversalCard from '../components/UniversalCard';
import { config } from '@/config';
import axios from 'axios';

interface User {
  userId: {
    username: string;
  };
}

const cards = [
  {
    title: 'Top 10 JavaScript Tips for Beginners',
    mediaUrl: 'https://www.youtube.com/watch?v=xyz123',
    hashtags: ['#JavaScript', '#WebDevelopment', '#CodingTips'],
    className: 'card-highlight',
  },
  {
    title: "Understanding React's useEffect Hook",
    mediaUrl: 'https://twitter.com/reactjs/status/123456789',
    hashtags: ['#ReactJS', '#Frontend', '#Hooks'],
    className: 'card-react',
  },
  {
    title: 'MERN Stack Project Showcase: Brain_Vault',
    mediaUrl: 'https://i.imgur.com/project-demo.jpg',
    hashtags: ['#MERN', '#FullStack', '#Project'],
    className: 'card-project',
  },
  {
    title: 'Fitness App Using MediaPipe: Demo Video',
    mediaUrl: 'https://example.com/fitness-demo.mp4',
    hashtags: ['#AI', '#FitnessApp', '#MediaPipe'],
    className: 'card-fitness',
  },
  {
    title: 'Master Time Management with the Eisenhower Matrix',
    mediaUrl: 'https://www.youtube.com/watch?v=matrix-tips',
    hashtags: ['#Productivity', '#TimeManagement', '#EisenhowerMatrix'],
    className: 'card-productivity',
  },
  {
    title: 'How to Save Taxes in 2024: Legal and Effective Strategies',
    mediaUrl: 'https://i.imgur.com/tax-tips.jpg',
    hashtags: ['#TaxSaving', '#Finance', '#India'],
  },
];

const Button = ({
  children,
  variant = 'default',
  className = '',
  theme = 'dark',
  ...props
}) => {
  const variants = {
    default:
      theme === 'dark' ? 'bg-purple-600 text-white' : 'bg-blue-500 text-white',
    outline:
      theme === 'dark'
        ? 'bg-zinc-900 text-zinc-100 border-zinc-800 hover:bg-zinc-800'
        : 'bg-white text-zinc-900 border-zinc-200 hover:bg-zinc-50',
  };

  return (
    <button
      className={`px-4 py-2 rounded-lg transition-colors ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const SharedPage = () => {
  const { id } = useParams();
  const [isDark, setIsDark] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFolderOpen, setIsFolderOpen] = useState(false);

  const [content, setContent] = useState<any[]>([]);

  const folders = [
    { id: 1, label: 'View all', count: 48 },
    { id: 2, label: 'Youtube', count: 6 },
    { id: 3, label: 'Twitter', count: 4 },
    { id: 4, label: 'Images', count: 22 },
    { id: 5, label: 'Videos', count: 14 },
    { id: 6, label: 'Audios', count: 14 },
  ];

  const themeClass = isDark ? 'bg-black text-white' : 'bg-white text-gray-900';
  const buttonHoverClass = isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100';

  const Sidebar = () => {
    const sidebarClass = isDark
      ? 'bg-black text-white border-gray-800'
      : 'bg-white text-gray-900 border-gray-200';
    const itemHoverClass = isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100';
    const textColorClass = isDark ? 'text-gray-400' : 'text-gray-500';

    return (
      <div
        className={`w-64 p-4 border-r ${sidebarClass} flex flex-col h-full overflow-y-auto`}
      >
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl" />
          <div className="flex-1">
            <div className="font-medium">Anonymous Dashboard</div>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Folders</span>
            <button onClick={() => setIsFolderOpen(!isFolderOpen)}>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          {isFolderOpen &&
            folders.map((folder) => (
              <div
                key={folder.id}
                className={`flex items-center justify-between py-2 px-2 ${itemHoverClass} rounded-lg cursor-pointer`}
              >
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  {folder.label}
                </span>
                <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>
                  {folder.count}
                </span>
              </div>
            ))}
        </div>

        <div className="mt-auto space-y-2">
          {[{ icon: Globe, label: 'Support' }].map(({ icon: Icon, label }) => (
            <button
              key={label}
              className={`flex items-center gap-3 w-full p-2 ${itemHoverClass} rounded-lg`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const getContent = async () => {
    try {
      const res = await axios.get(`${config.BACKEND_URL}/user/brain/${id}`);
      if (!res?.data?.success) {
        console.log(res.data.message);
      } else {
        setContent(res.data.data);
        console.log(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getContent();
  }, [id]);
  return (
    <div>
      <div
        className={`flex h-screen ${themeClass} transition-colors duration-200`}
      >
        <button
          className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden ${
            isSidebarOpen ? 'block' : 'hidden'
          }`}
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close sidebar"
        />

        <div
          className={`fixed inset-y-0 left-0 z-50 transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0`}
        >
          <Sidebar />
        </div>

        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <div className="flex-1 p-4 md:p-8 overflow-y-auto scrollbar-hide">
            <div className="fixed"></div>
            <div className="flex flex-row md:flex-row md:items-center justify-between gap-4 mb-8 ">
              {' '}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 rounded-lg hover:bg-gray-800 lg:hidden"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-semibold text-left ">
                  Welcome Anonymous
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <button
                    onClick={() => setIsDark(!isDark)}
                    className={`p-2 rounded-lg ${buttonHoverClass}`}
                  >
                    {isDark ? (
                      <Sun className="w-4 h-4" />
                    ) : (
                      <Moon className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4  ">
              {content.map((card) => (
                <div key={card._id}>
                  <UniversalCard
                    id={'undefined'}
                    title={card.info.title}
                    description={card.info.description}
                    mediaUrl={card.link}
                    hashtags={card.mainTagId.title}
                    theme={isDark ? 'dark' : 'light'}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedPage;
