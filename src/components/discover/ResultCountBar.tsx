import { useTranslation } from 'react-i18next';
import { CardsIcon, MapIcon, TableIcon } from '@/lib/icons';
import { useSearch } from '@/store/search-store';

interface Props {
  /** Null when the backend declines to count; undefined while the first page loads. */
  total: number | null | undefined;
}

export default function ResultCountBar({ total }: Props) {
  const { t } = useTranslation();
  const { locationLabel } = useSearch();

  return (
    <div className="flex items-center justify-between gap-2 px-4 pt-3 pb-1">
      <p aria-live="polite" className="text-ink-2 truncate text-sm font-medium">
        {total === undefined || total === null
          ? t('common.loading')
          : t('count.results', { count: total, area: locationLabel })}
      </p>

      <div className="flex shrink-0 items-center gap-1" aria-hidden="true">
        <span className="bg-tint text-tint-ink grid size-11 place-items-center rounded-[12px]">
          <CardsIcon className="size-5" />
        </span>
        <span
          className="text-ink-3 grid size-11 place-items-center rounded-[12px]"
          title={t('nav.comingSoon')}
        >
          <TableIcon className="size-5" />
        </span>
        <span
          className="text-ink-3 grid size-11 place-items-center rounded-[12px]"
          title={t('nav.comingSoon')}
        >
          <MapIcon className="size-5" />
        </span>
      </div>
    </div>
  );
}
