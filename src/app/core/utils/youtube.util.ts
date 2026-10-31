/**
 * Utilidades para validar, extraer ID, miniatura y URL embebida de videos de YouTube.
 * Soporta enlaces estándar (watch?v=), cortos (youtu.be/), Shorts (youtube.com/shorts/),
 * enlaces móviles (m.youtube.com) y URLs embebidas (youtube.com/embed/).
 */

const YOUTUBE_ID_REGEX = /(?:youtube\.com\/(?:watch\?.*v=|embed\/|shorts\/|v\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

export function extractYouTubeId(url?: string | null): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  const match = trimmed.match(YOUTUBE_ID_REGEX);
  if (match && match[1]) {
    return match[1];
  }

  return null;
}

export function isValidYouTubeUrl(url?: string | null): boolean {
  if (!url || !url.trim()) return true; // Opcional cuando está vacío
  return extractYouTubeId(url) !== null;
}

export function getYouTubeEmbedUrl(url?: string | null, autoplay = false): string | null {
  const videoId = extractYouTubeId(url);
  if (!videoId) return null;
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
  });
  if (autoplay) {
    params.set('autoplay', '1');
  }
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

export function getYouTubeThumbnailUrl(url?: string | null): string | null {
  const videoId = extractYouTubeId(url);
  if (!videoId) return null;
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

