import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';
import DeleteModal from './DeleteModal';
import axios from 'axios';
import { config } from '@/config';

const MediaEmbed = ({ url }) => {
  const [isLoading, setIsLoading] = useState(true);

  const getEmbedType = (url) => {
    if (!url) return 'none';
    if (url.includes('youtube.com') || url.includes('youtu.be'))
      return 'youtube';
    if (url.includes('x.com')) return 'twitter';
    if (url.match(/\.(jpeg|jpg|gif|png)$/)) return 'image';
    if (url.match(/\.(mp4|webm)$/)) return 'video';
    return 'default';
  };

  const getYouTubeId = (url) => {
    const regex =
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const type = getEmbedType(url);

  const handleLoad = () => setIsLoading(false);

  const mediaContent = () => {
    switch (type) {
      case 'youtube': {
        const videoId = getYouTubeId(url);
        return (
          <iframe
            className="w-full h-full rounded-lg"
            src={`https://www.youtube.com/embed/${videoId}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={handleLoad}
            title={`YouTube video - ${videoId}`}
          />
        );
      }
      case 'twitter':
        return (
          <blockquote className="twitter-tweet w-full h-full rounded-lg">
            <a href={url.replace('x.com', 'twitter.com')}>Loading tweet...</a>
            <script
              async
              src="https://platform.twitter.com/widgets.js"
            ></script>
          </blockquote>
        );
      case 'image':
        return (
          <img
            src={url}
            alt="Content"
            className="w-full h-full object-cover rounded-lg"
            onLoad={handleLoad}
          />
        );
      case 'video':
        return (
          <video
            controls
            className="w-full h-full rounded-lg"
            onLoadedData={handleLoad}
          >
            <source src={url} />
            Your browser does not support the video tag.
          </video>
        );
      default:
        return (
          <iframe
            className="w-full aspect-video"
            src={url}
            onLoad={handleLoad}
            title={`Embedded content - ${url}`}
          />
        );
    }
  };

  return (
    <div className="relative w-full aspect-video">
      {isLoading && (
        <Skeleton className="w-full h-full absolute top-0 left-0" />
      )}
      {mediaContent()}
    </div>
  );
};

type UniversalCardProps = {
  id: string;
  title: string;
  mediaUrl: string;
  hashtags: string[];
  theme: string;
  className?: string;
  description?: string;
};

const UniversalCard = ({
  id,
  title,
  mediaUrl,
  description,

  hashtags = [],
  className = '',
  theme,
}: UniversalCardProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contentId, setContentId] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  return (
    <>
      <Card
        className={`
          group 
          w-full
          max-w-sm
          h-[420px]
          flex 
          flex-col 
          overflow-hidden 
          transition-shadow 
          duration-300 
          hover:shadow-lg 
          ${
            theme === 'dark'
              ? 'bg-black text-zinc-100'
              : 'bg-white text-zinc-900'
          }
          border 
          ${theme === 'dark' ? 'border-zinc-700' : 'border-zinc-200'}
          rounded-lg
          ${className}
        `}
      >
        <CardHeader className="w-full p-4 flex-shrink-0 flex justify-between items-start relative">
          <CardTitle
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className={`
                w-[300px]
                text-left
                
                text-xl 
                font-semibold 
                tracking-tight 
                line-clamp-2
                cursor-pointer
                ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}
              `}
          >
            {title}
          </CardTitle>

          {showTooltip && (
            <div
              className={`
                  absolute
                  z-50
                  top-full
                  left-0
                  mt-2
                  p-3
                  rounded-lg
                  shadow-lg
                  max-w-xs
                  border
                  ${
                    theme === 'dark'
                      ? 'bg-zinc-800 border-zinc-700 text-zinc-200'
                      : 'bg-white border-zinc-200 text-zinc-800'
                  }
                `}
            >
              <div className="space-y-2">
                <button
                  onClick={() =>
                    setIsDescriptionExpanded(!isDescriptionExpanded)
                  }
                  className="cursor-pointer w-full text-left"
                >
                  <p className="text-sm font-medium">
                    Description:{' '}
                    {isDescriptionExpanded
                      ? description
                      : `${description?.slice(0, 100)}...`}
                  </p>
                </button>

                <p className="text-xs opacity-75 truncate">URL: {mediaUrl}</p>
              </div>
            </div>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              setContentId(id);
              setShowDeleteModal(true);
            }}
            className={`
                p-2
                rounded-full
                transition-colors
                flex-shrink-0
                absolute
                top-4
                right-2
                ${
                  theme === 'dark'
                    ? 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                    : 'hover:bg-zinc-100 text-zinc-500 hover:text-zinc-700'
                }
              `}
            aria-label="Delete card"
          >
            <Trash2 size={18} />
          </button>
        </CardHeader>

        <CardContent className="p-4 flex flex-col flex-1 min-h-0">
          <div className="flex justify-start overflow-hidden rounded-lg h-[200px] w-full mb-4 flex-shrink-0">
            <a href={mediaUrl} className="w-full">
              <MediaEmbed url={mediaUrl} />
            </a>
          </div>

          <div className="flex flex-wrap gap-2 flex-1 min-h-0 max-h-20">
            {hashtags.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className={`
                  px-3 
                  py-1 
                  text-sm 
                  font-medium 
                  transition-all 
                  duration-200 
                  cursor-pointer
                  ${
                    theme === 'dark'
                      ? 'bg-zinc-700 text-zinc-200'
                      : 'bg-zinc-200 text-zinc-800'
                  }
                  hover:bg-primary 
                  hover:text-primary-foreground 
                `}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          axios.delete(`${config.BACKEND_URL}/user/content`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            data: {
              contentId: contentId,
            },
          });
          setShowDeleteModal(false);
        }}
        theme={theme}
      />
    </>
  );
};

export default UniversalCard;
