import { useTranslation } from 'react-i18next';

import { PlaceCardSkeleton } from '@/components/discover/PlaceCard';
import { CompassIcon } from '@/lib/icons';

export function LoadingState() {
  const { t } = useTranslation();

  return (
    <div aria-busy="true" className="space-y-[22px] px-4 pt-3">
      <span className="sr-only">{t('common.loading')}</span>
      <div className="bg-skel h-4 w-40 rounded" aria-hidden="true" />
      <PlaceCardSkeleton />
      <PlaceCardSkeleton />
      <PlaceCardSkeleton />
    </div>
  );
}

interface EmptyStateProps {
  onExpandRadius: () => void;
  onClearAll: () => void;
}

export function EmptyState({ onExpandRadius, onClearAll }: EmptyStateProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center gap-3 px-6 pt-12 text-center">
      <span className="bg-tint text-tint-ink grid size-16 place-items-center rounded-full">
        <CompassIcon aria-hidden="true" className="size-8" />
      </span>
      <h2 className="text-lg font-bold">{t('empty.title')}</h2>
      <p className="text-ink-2 text-sm">{t('empty.help')}</p>
      <button
        type="button"
        onClick={onExpandRadius}
        className="bg-primary text-primary-foreground h-11 w-full max-w-xs rounded-[14px] font-semibold"
      >
        {t('empty.expand')}
      </button>
      <button
        type="button"
        onClick={onClearAll}
        className="border-line h-11 w-full max-w-xs rounded-[14px] border font-semibold"
      >
        {t('empty.clearAll')}
      </button>
    </div>
  );
}

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  const { t } = useTranslation();

  return (
    <div role="alert" className="flex flex-col items-center gap-3 px-6 pt-12 text-center">
      <h2 className="text-lg font-bold">{t('error.title')}</h2>
      <p className="text-ink-2 text-sm">{t('error.help')}</p>
      <button
        type="button"
        onClick={onRetry}
        className="bg-primary text-primary-foreground h-11 w-full max-w-xs rounded-[14px] font-semibold"
      >
        {t('error.retry')}
      </button>
    </div>
  );
}
