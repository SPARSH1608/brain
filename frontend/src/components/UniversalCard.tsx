import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const MediaEmbed = ({ url }) => {
  const [isLoading, setIsLoading] = useState(true);

  const getEmbedType = (url) => {
    if (!url) return 'none';
    if (url.includes('youtube.com') || url.includes('youtu.be'))
      return 'youtube';
    if (url.includes('twitter.com')) return 'twitter';
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
          />
        );
      }
      case 'twitter':
        return (
          <iframe
            className="w-full h-full rounded-lg"
            src={`https://twitframe.com/show?url=${encodeURIComponent(url)}`}
            onLoad={handleLoad}
          />
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
            className="w-full h-full rounded-lg"
            src={url}
            onLoad={handleLoad}
          />
        );
    }
  };

  return (
    <div className="relative h-full">
      {isLoading && (
        <Skeleton className="w-full h-full rounded-lg absolute top-0 left-0" />
      )}
      {mediaContent()}
    </div>
  );
};

type UniversalCardProps = {
  title: string;
  mediaUrl: string;
  hashtags: string[];
  theme: string;
  className?: string;
};

const UniversalCard = ({
  title,
  mediaUrl,
  hashtags = [],
  className = '',
  theme,
}: UniversalCardProps) => {
  return (
    <Card
      className={`
        group 
        w-72rem
        h-[400px] 
        flex 
        flex-col 
        overflow-hidden 
        transition-shadow 
        duration-300 
        hover:shadow-lg 
        ${
          theme === 'dark' ? 'bg-black text-zinc-100' : 'bg-white text-zinc-900'
        }
        border 
        ${theme === 'dark' ? 'border-zinc-700' : 'border-zinc-200'}
        rounded-lg
        ${className}
      `}
    >
      <CardHeader className="p-4">
        <CardTitle
          className={`
            text-xl 
            font-semibold 
            tracking-tight 
            line-clamp-2 
            
          `}
        >
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 flex flex-col flex-grow ">
        <div className="flex overflow-hidden rounded-lg h-[200px] mb-4">
          <MediaEmbed url={mediaUrl} />
        </div>

        <div className="flex flex-wrap gap-2 overflow-auto max-h-20">
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
              #{tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UniversalCard;
