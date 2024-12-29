import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  Hash,
  MoreHorizontal,
  ThumbsUp,
  MessageSquare,
} from 'lucide-react';

const SearchUI = () => {
  const [isDark, setIsDark] = useState(false);
  const [query, setQuery] = useState('');
  const [showHashtags, setShowHashtags] = useState(false);

  const popularHashtags = [
    { id: 1, tag: 'design', count: 2453 },
    { id: 2, tag: 'development', count: 1832 },
    { id: 3, tag: 'ui', count: 943 },
    { id: 4, tag: 'ux', count: 785 },
    { id: 5, tag: 'product', count: 654 },
  ];

  useEffect(() => {
    setShowHashtags(query.startsWith('#'));
  }, [query]);

  const themeClasses = {
    bg: isDark ? 'bg-black' : 'bg-white',
    card: isDark ? 'bg-gray-900' : 'bg-white',
    text: isDark ? 'text-white' : 'text-gray-900',
    border: isDark ? 'border-gray-800' : 'border-gray-200',
    input: isDark ? 'bg-gray-900 text-white' : 'bg-white text-black',
    hashtag: isDark
      ? 'bg-gray-800 hover:bg-gray-700'
      : 'bg-gray-100 hover:bg-gray-200',
  };

  const searchResults = [
    {
      id: 1,
      user: {
        name: 'Yasir Ekinci',
        avatar: '/api/placeholder/32/32',
      },
      content:
        'Image of a wizard wandering through a snow-covered Hogsmeade. Use cinematic, photography style. Its almost winter holiday.',
      type: 'prompt',
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
      type: 'response',
      image: '/api/placeholder/400/300',
      likes: 89,
      responses: 12,
    },
    {
      id: 1,
      user: {
        name: 'Yasir Ekinci',
        avatar: '/api/placeholder/32/32',
      },
      content:
        'Image of a wizard wandering through a snow-covered Hogsmeade. Use cinematic, photography style. Its almost winter holiday.',
      type: 'prompt',
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
      type: 'response',
      image: '/api/placeholder/400/300',
      likes: 89,
      responses: 12,
    },
  ];

  return (
    <div className={`${themeClasses.bg} min-h-screen flex flex-col`}>
      {/* Results Container - Scrollable Area */}
      <div className="flex-grow overflow-y-auto mb-20">
        <div className="max-w-3xl mx-auto space-y-4 p-4">
          {searchResults.map((result) => (
            <div
              key={result.id}
              className={`p-4 rounded-xl border ${themeClasses.border} ${themeClasses.card}`}
            >
              <div className="flex items-start gap-3 mb-3">
                <img
                  src={result.user.avatar}
                  alt={result.user.name}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1">
                  <h3 className={`font-medium ${themeClasses.text}`}>
                    {result.user.name}
                  </h3>
                  <p className={`text-gray-500 text-sm ${themeClasses.text}`}>
                    {result.content}
                  </p>
                </div>
              </div>

              {result.image && (
                <div className="mb-3">
                  <img
                    src={result.image}
                    alt="Generated result"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Interaction buttons */}
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

      {/* Fixed Search Container */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 ${
          isDark
            ? 'bg-black border-t border-gray-800'
            : 'bg-white border-t border-gray-200'
        } shadow-2xl`}
      >
        <div className="max-w-3xl mx-auto p-4">
          {/* Hashtag Dropdown */}
          {showHashtags && (
            <div
              className={`absolute bottom-full mb-4 w-full max-w-[46rem] p-4 ${
                isDark
                  ? 'bg-gray-900 border-gray-800'
                  : 'bg-white border-gray-200'
              } border rounded-t-xl shadow-lg`}
            >
              <h3 className="text-sm font-medium mb-3">Popular Hashtags</h3>
              <div className="flex flex-wrap gap-2">
                {popularHashtags.map(({ id, tag, count }) => (
                  <button
                    key={id}
                    onClick={() => setQuery(`#${tag}`)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-colors ${themeClasses.hashtag}`}
                  >
                    <Hash className="w-3 h-3" />
                    <span>{tag}</span>
                    <span className="text-gray-500 text-xs">({count})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Input */}
          <div className="relative flex items-center">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowHashtags(e.target.value.startsWith('#'));
              }}
              placeholder="Ask me anything..."
              className={`w-full pl-12 pr-12 py-3 rounded-full border focus:outline-none focus:ring-2 focus:ring-purple-500 ${themeClasses.input}`}
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
        </div>
      </div>
    </div>
  );
};

export default SearchUI;
