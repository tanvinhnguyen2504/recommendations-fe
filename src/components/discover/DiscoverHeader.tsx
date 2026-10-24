import { useTranslation } from 'react-i18next';

import { setLocale } from '@/i18n';
import { useLocale } from '@/hooks/useLocale';
import { ChevronDownIcon, PinIcon, SearchIcon } from '@/lib/icons';
import { withCategory, withSearchTerm } from '@/lib/search';
import { useSearch } from '@/store/search-store';
import { cn } from 'cn';
import { Category } from '@/types/place';

const CATEGORIES: { value: 'all' | Category; labelKey: string }[] = [
  { value: 'all', labelKey: 'discover.categoryAll' },
  { value: 'food', labelKey: 'discover.categoryFood' },
  { value: 'cafe', labelKey: 'discover.categoryCafe' },
];

interface Props {
  onOpenLocation: () => void;
  /** Collapsed on scroll: the location and search rows hide, the toolbar stays. */
  collapsed: boolean;
}

export default function DiscoverHeader({ onOpenLocation, collapsed }: Props) {
  const { t } = useTranslation();
  const locale = useLocale();
  const { query, update, locationLabel } = useSearch();

  return (
    <div className="bg-background px-4">
      <div
        className={cn(
          'grid overflow-hidden transition-[grid-template-rows,opacity] duration-200',
          collapsed ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100',
        )}
        // Collapsing uses a grid-rows transition rather than unmounting: unmounting the
        // search input would drop focus and dismiss the keyboard mid-typing.
        aria-hidden={collapsed}
      >
        <div className="min-h-0">
          <div className="flex items-center gap-2 pt-2 pb-3">
            <button
              type="button"
              onClick={onOpenLocation}
              aria-label={t('a11y.openLocation')}
              className="rounded-chip bg-surface border-line flex h-11 min-w-0 flex-1 items-center gap-1.5 border px-3"
            >
              <PinIcon aria-hidden="true" className="text-primary size-5 shrink-0" />
              <span className="truncate text-sm font-semibold">{locationLabel}</span>
              <ChevronDownIcon aria-hidden="true" className="text-ink-2 size-4 shrink-0" />
            </button>

            <div className="rounded-chip bg-surface-2 flex h-11 shrink-0 items-center p-1">
              {(['vi', 'en'] as const).map((value) => {
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={locale === value}
                    onClick={() => {
                      setLocale(value);
                    }}
                    className={cn(
                      'rounded-chip h-9 px-3 text-sm font-bold uppercase',
                      locale === value ? 'bg-ink text-background' : 'text-ink-2',
                    )}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="relative mb-3 block">
            <span className="sr-only">{t('discover.searchPlaceholder')}</span>
            <SearchIcon
              aria-hidden="true"
              className="text-ink-2 pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2"
            />
            <input
              type="search"
              value={query.q ?? ''}
              onChange={(event) => {
                update((current) => {
                  return withSearchTerm(current, event.target.value);
                });
              }}
              placeholder={t('discover.searchPlaceholder')}
              className="bg-surface-2 placeholder:text-ink-2 h-[46px] w-full rounded-[14px] pr-3 pl-10"
            />
          </label>
        </div>
      </div>

      <div role="tablist" className="rounded-chip bg-surface-2 mb-3 flex h-11 items-center p-1">
        {CATEGORIES.map(({ value, labelKey }) => {
          const active = query.category === value;

          return (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => {
                update((current) => {
                  return withCategory(current, value);
                });
              }}
              className={cn(
                'rounded-chip h-9 flex-1 text-sm font-semibold',
                active ? 'bg-surface text-ink shadow-segment' : 'text-ink-2',
              )}
            >
              {t(labelKey)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
