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
import { useNavigate } from 'react-router';
import UniversalCard from '../components/UniversalCard';
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
    className: 'card-finance',
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
        ? 'border border-gray-600 hover:bg-[#BFDBF847]'
        : 'border border-gray-300 hover:bg-gray-200',
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

const Dashboard = () => {
  const [isDark, setIsDark] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFolderOpen, setIsFolderOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState('');
  const [showHashtags, setShowHashtags] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const navigate = useNavigate();
  const popularHashtags = [
    { id: 1, tag: 'design', count: 2453 },
    { id: 2, tag: 'development', count: 1832 },
    { id: 3, tag: 'ui', count: 943 },
    { id: 4, tag: 'ux', count: 785 },
    { id: 5, tag: 'product', count: 654 },
  ];

  useEffect(() => {
    console.log('hi');
    setShowHashtags(query.startsWith('#'));
  }, [query]);
  const handleQueryChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    // Only show hashtags when query starts with '#'
    setShowHashtags(newQuery.startsWith('#'));
  };
  const handleLogout = () => {
    // Clear authentication token
    localStorage.removeItem('authToken');

    // Reset authentication state
    setIsAuthenticated(false);

    // Redirect to login page
    // Option 1: Using React Router
    navigate('/signin');

    // Option 2: Window redirect
    // window.location.href = '/login';
  };

  const folders = [
    { id: 1, label: 'View all', count: 48 },
    { id: 2, label: 'Youtube', count: 6 },
    { id: 3, label: 'Twitter', count: 4 },
    { id: 4, label: 'Images', count: 22 },
    { id: 5, label: 'Videos', count: 14 },
    { id: 6, label: 'Audios', count: 14 },
  ];

  const searchResults = [
    {
      id: 1,
      user: {
        name: 'Yasir Ekinci',
        avatar: '/api/placeholder/32/32',
      },
      content:
        'Image of a wizard wandering through a snow-covered Hogsmeade. Use cinematic, photography style.',
      likes: 124,
      responses: 24,
    },
    {
      id: 2,
      user: {
        name: 'Something AI',
        avatar: '/api/placeholder/32/32',
      },
      content:
        "Creative choice Yasir! Let's conjure up an image of a wizard ambling through the mystical streets of Hogsmeade.",
      image: '/api/placeholder/400/300',
      likes: 89,
      responses: 12,
    },
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
            <div className="font-medium">Sparsh Dashboard</div>
            <div className={textColorClass}>sparshgoelk@gmail.com</div>
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
          {[
            { icon: Globe, label: 'Support' },

            { icon: Settings, label: 'Logout' },
          ].map(({ icon: Icon, label }) => (
            <button
              key={label}
              onClick={label === 'Logout' ? handleLogout : undefined}
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

  return (
    <>
      <div className="absolute top-0 left-0 w-full z-50">
        {isModalOpen && (
          <FileUploader
            theme={isDark ? 'dark' : 'light'}
            isModalOpen={isModalOpen}
            setModalOpen={setModalOpen}
          />
        )}
        {isShareOpen && (
          <ShareBrain
            theme={isDark ? 'dark' : 'light'}
            isShareOpen={isShareOpen}
            setIsShareOpen={setIsShareOpen}
          />
        )}
      </div>
      <div
        className={`flex h-screen ${themeClass} transition-colors duration-200`}
      >
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden ${
            isSidebarOpen ? 'block' : 'hidden'
          }`}
          onClick={() => setIsSidebarOpen(false)}
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
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-800 lg:hidden"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-semibold ">Welcome back</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <button
                    onClick={() => setShowSearch(!showSearch)}
                    className={`p-2 rounded-lg ${buttonHoverClass} ${
                      showSearch ? 'bg-purple-600 text-white' : ''
                    }`}
                  >
                    {showSearch ? (
                      <LayoutGrid className="w-4 h-4" />
                    ) : (
                      <Search className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
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

            {!showSearch ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-12 mb-8">
                  <span onClick={() => setModalOpen(true)}>
                    <Button
                      variant="outline"
                      theme={isDark ? 'dark' : 'light'}
                      className="flex items-center gap-2 w-full justify-center"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="">New Content</span>
                    </Button>
                  </span>
                  <span onClick={() => setIsShareOpen(true)}>
                    <Button
                      variant="outline"
                      theme={isDark ? 'dark' : 'light'}
                      className="flex items-center gap-2 w-full justify-center"
                    >
                      <ShareIcon className="w-4 h-4" />
                      <span className="">Share Brain</span>
                    </Button>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4  ">
                  {cards.map((card) => (
                    <div>
                      <UniversalCard
                        title={card.title}
                        mediaUrl={card.mediaUrl}
                        hashtags={card.hashtags}
                        className=""
                        theme={isDark ? 'dark' : 'light'}
                      />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="relative flex items-center">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={query}
                    onChange={handleQueryChange}
                    placeholder="Ask me anything..."
                    className={`w-full pl-12 pr-12 py-3 rounded-full border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      isDark
                        ? 'bg-gray-900 border-gray-800 text-white'
                        : 'bg-white border-gray-200 text-black'
                    }`}
                  />
                  {query && (
                    <button
                      onClick={() => setQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-700 text-gray-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {showHashtags && (
                  <div
                    className={` bottom-full mb-4 w-full  p-4 z-12 ${
                      isDark
                        ? 'bg-gray-900 border-gray-800'
                        : 'bg-white border-gray-200'
                    } border rounded-b-xl shadow-lg `}
                  >
                    <h3 className="text-sm font-medium mb-3">
                      Popular Hashtags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {popularHashtags.map(({ id, tag, count }) => (
                        <button
                          key={id}
                          onClick={() => {
                            setQuery(`#${tag}`);
                            setShowHashtags(true);
                          }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-colors`}
                        >
                          <Hash className="w-3 h-3" />
                          <span>{tag}</span>
                          <span className="text-gray-500 text-xs">
                            ({count})
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="space-y-4">
                  {searchResults.map((result) => (
                    <div
                      key={result.id}
                      className={`p-4 rounded-xl border ${
                        isDark
                          ? 'border-gray-800 bg-gray-900'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <img
                          src={result.user.avatar}
                          alt={result.user.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium">{result.user.name}</h3>
                          <p className="text-gray-500 text-sm">
                            {result.content}
                          </p>
                        </div>
                      </div>

                      {result.image && (
                        <div className="mb-3">
                          <img
                            src={result.image}
                            alt="Search result"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-gray-500">
                        <button className="flex items-center gap-1 hover:text-gray-300">
                          <MessageSquare className="w-4 h-4" />
                          <span className="text-sm">{result.responses}</span>
                        </button>
                        <button className="flex items-center gap-1 hover:text-gray-300">
                          <ThumbsUp className="w-4 h-4" />
                          <span className="text-sm">{result.likes}</span>
                        </button>
                        <button className="ml-auto hover:text-gray-300">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
