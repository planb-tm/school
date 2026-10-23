import type { LessonVideo, LessonVideoType } from '@/types/learning';

const EMBED_HOSTS = new Set([
  'www.youtube.com',
  'youtube.com',
  'm.youtube.com',
  'www.youtube-nocookie.com',
  'youtube-nocookie.com',
  'youtu.be',
  'player.vimeo.com',
  'vimeo.com',
  'vkvideo.ru',
  'www.vkvideo.ru',
  'vk.com',
  'www.vk.com',
]);

function vkEmbedSrc(url: URL): string | null {
  const match = url.pathname.match(/\/video(-?\d+)_(\d+)/i);
  if (!match) return null;
  const oid = match[1];
  const id = match[2];
  if (!oid || !id) return null;
  const list = url.searchParams.get('list');
  const listParam = list
    ? `&list=${encodeURIComponent(list)}`
    : '';
  return `https://vkvideo.ru/video_ext.php?oid=${encodeURIComponent(oid)}&id=${encodeURIComponent(id)}&hd=2${listParam}`;
}

function parseHttpsUrl(raw: string): URL | null {
  try {
    const url = new URL(raw.trim());
    if (url.protocol !== 'https:') return null;
    return url;
  } catch {
    return null;
  }
}

function youtubeId(url: URL): string | null {
  if (url.hostname === 'youtu.be') {
    const id = url.pathname.split('/').filter(Boolean)[0];
    return id || null;
  }

  const fromQuery = url.searchParams.get('v');
  if (fromQuery) return fromQuery;

  const parts = url.pathname.split('/').filter(Boolean);
  if (parts[0] === 'embed' || parts[0] === 'shorts') {
    return parts[1] || null;
  }

  return null;
}

/** Returns a safe playback URL or null if the source is not allowed. */
export function resolveLessonVideoSrc(
  video: Pick<LessonVideo, 'type' | 'url'>,
): string | null {
  const url = parseHttpsUrl(video.url);
  if (!url) return null;

  if (video.type === 'mp4') {
    return url.href;
  }

  if (video.type === 'embed') {
    if (!EMBED_HOSTS.has(url.hostname)) return null;

    if (url.hostname.includes('youtube') || url.hostname === 'youtu.be') {
      const id = youtubeId(url);
      if (!id || !/^[\w-]{6,}$/.test(id)) return null;
      return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?rel=0`;
    }

    if (url.hostname === 'vimeo.com') {
      const id = url.pathname.split('/').filter(Boolean)[0];
      if (!id || !/^\d+$/.test(id)) return null;
      return `https://player.vimeo.com/video/${id}`;
    }

    if (url.hostname === 'player.vimeo.com') {
      return url.href;
    }

    if (url.hostname.includes('vk')) {
      return vkEmbedSrc(url);
    }
  }

  return null;
}

export function isSupportedLessonVideoType(
  type: string,
): type is LessonVideoType {
  return type === 'embed' || type === 'mp4';
}
