export function detectContentType(input: any) {
  // Check if the input is a valid URL
  console.log(input);
  const urlPattern = /^(https?:\/\/)?([a-z0-9-]+(\.[a-z0-9-]+)+)(\/[^\s]*)?$/i;
  if (urlPattern.test(input)) {
    return 'link'; // It's a URL/link
  }

  // Check if the input is likely an image, video, or audio URL (based on file extension)
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
  const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv'];
  const audioExtensions = ['.mp3', '.wav', '.aac', '.ogg'];

  if (input.mimetype.startsWith('image/')) {
    return 'image'; // It's an image
  }
  if (input.mimetype.startsWith('video/')) {
    return 'video'; // It's a video
  }
  if (input.mimetype.startsWith('audio/')) {
    return 'audio'; // It's audio
  }

  // If none of the above, assume it's text
  return 'text'; // Default to text
}
