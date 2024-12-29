import { Copy } from 'lucide-react';

const ShareBrain = ({
  isShareOpen,
  setIsShareOpen,
  theme = 'dark', // Add theme prop with default dark
}: {
  isShareOpen: boolean;
  setIsShareOpen: (open: boolean) => void;
  theme?: 'light' | 'dark';
}) => {
  // Theme-based color classes
  const themeClasses = {
    backdrop: {
      dark: 'bg-black/50',
      light: 'bg-gray-500/30',
    },
    container: {
      dark: 'bg-gray-900 border-gray-800 text-white',
      light: 'bg-white border-gray-200 text-gray-900',
    },
    link: {
      dark: 'text-purple-400 hover:text-purple-300',
      light: 'text-purple-600 hover:text-purple-700',
    },
    text: {
      dark: 'text-gray-400',
      light: 'text-gray-600',
    },
    button: {
      dark: 'bg-purple-600 hover:bg-purple-700 text-white',
      light: 'bg-purple-500 hover:bg-purple-600 text-white',
    },
  };

  return (
    <div
      className={`
        fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center 
        ${themeClasses.backdrop[theme]}
      `}
    >
      <div
        className={`
          w-full max-w-md rounded-xl p-6 border 
          ${themeClasses.container[theme]}
          shadow-lg
        `}
      >
        {/* Header */}
        <h2
          className={`
            text-lg font-semibold mb-4 
            ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
          `}
        >
          Share your brain with this Link
        </h2>

        {/* Link Section */}
        <div
          className={`
            p-3 rounded-lg 
            ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}
            mb-4
          `}
        >
          <p
            className={`
              text-sm break-all 
              ${themeClasses.text[theme]}
            `}
          >
            Share Link:{' '}
            <a
              href=""
              className={`
                font-medium 
                ${themeClasses.link[theme]}
                transition-colors
              `}
            >
              http://localhost:5173/adbbabfiabfabfaebfajfb
            </a>
          </p>
        </div>

        {/* Additional Information */}
        <div
          className={`
            text-sm mb-4 
            ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}
          `}
        >
          <p>
            • Anyone with this link can access your brain • Be careful who you
            share this with
          </p>
        </div>

        {/* Copy Link Button */}
        <div className="flex space-x-3 mb-4">
          <button
            className={`
              flex-1 py-2 rounded-lg 
              flex items-center justify-center 
              space-x-2
              ${
                theme === 'dark'
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }
              transition-colors
            `}
          >
            <Copy
              className={`w-4 h-4 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            />
            <span>Copy Link</span>
          </button>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setIsShareOpen(!isShareOpen)}
            className={`
              px-4 py-2 text-sm rounded-lg 
              transition-colors
              ${
                theme === 'dark'
                  ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }
            `}
          >
            Cancel
          </button>
          <button
            className={`
              px-4 py-2 text-sm rounded-lg 
              ${themeClasses.button[theme]}
              transition-colors
            `}
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareBrain;
