import { LessonVideoPlayer } from '@/components/LessonVideoPlayer';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import {
  businessEssenceMeta,
  businessEssenceVideo,
} from '@/data/learning/businessEssence';

export function BusinessEssencePage() {
  return (
    <PageContainer>
      <PageHeader title={businessEssenceMeta.title} backTo="/" />
      <section className="media-panel" aria-label="Видео о сути бизнеса">
        <LessonVideoPlayer video={businessEssenceVideo} />
        <a
          className="external-links__item"
          href={businessEssenceVideo.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Открыть видео
        </a>
      </section>
    </PageContainer>
  );
}
