import type { LessonVideo } from '@/types/learning';

export const businessEssenceMeta = {
  id: 'business-essence',
  title: 'Суть бизнеса',
  path: '/learn/business-essence',
  catalogDescription:
    'Посмотри вводное видео о сути бизнеса Oriflame и обсуди, что тебе интересно.',
} as const;

export const BUSINESS_ESSENCE_VIDEO_URL =
  'https://kinescope.io/87pANSt571Np3CPcvdZc1d';

export const BUSINESS_ESSENCE_VIDEO_POSTER = `${import.meta.env.BASE_URL}media/business-essence-cover.png`;

export const businessEssenceVideo: LessonVideo = {
  type: 'embed',
  url: BUSINESS_ESSENCE_VIDEO_URL,
  poster: BUSINESS_ESSENCE_VIDEO_POSTER,
  aspectRatio: '9:16',
  title: 'Видео о сути бизнеса Oriflame',
  duration: '~20 мин',
  description:
    'Видео Надежды Долиной о сути бизнеса Oriflame. Открой по кнопке воспроизведения или по ссылке ниже.',
};
