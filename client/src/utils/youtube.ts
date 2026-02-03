/**
 * Convierte una URL de YouTube o Facebook a formato embed
 */
export function getYouTubeEmbedUrl(url: string): string {
  if (!url) return '';
  
  // Si ya es una URL embed, la devolvemos tal como está
  if (url.includes('embed')) {
    return url;
  }

  // Soporte para Facebook
  if (url.includes('facebook.com') || url.includes('fb.watch')) {
    // Las URLs de Facebook se pueden embeber usando su plugin de video
    // Formato: https://www.facebook.com/plugins/video.php?href=URL_ENCODED
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0&width=560`;
  }
  
  // Patrones para diferentes formatos de YouTube
  const patterns = [
    // https://www.youtube.com/watch?v=VIDEO_ID
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
    // https://youtu.be/VIDEO_ID
    /(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]+)/,
    // https://m.youtube.com/watch?v=VIDEO_ID
    /(?:https?:\/\/)?m\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
    // https://www.youtube.com/shorts/VIDEO_ID
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/,
    // https://youtube.com/shorts/VIDEO_ID
    /(?:https?:\/\/)?youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
  }
  
  // Si no coincide con ningún patrón, devolvemos la URL original
  return url;
}