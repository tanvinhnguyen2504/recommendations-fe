import { useTranslation } from 'react-i18next';

import { CloseIcon } from '@/lib/icons';
import { activeChips, clearFilters } from '@/lib/search';
import { useSearch } from '@/store/search-store';

export default function ActiveFilterRow() {
  const { t } = useTranslation();
  const { query, update } = useSearch();

  const chips = activeChips(query);
  if (chips.length === 0) {
    return null;
  }

  return (
    <ul className="flex gap-2 overflow-x-auto px-4 pt-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {chips.map((chip) => {
        const label = t(chip.labelKey, chip.params);

        return (
          <li key={chip.id} className="shrink-0">
            <button
              type="button"
              aria-label={t('a11y.removeFilter', { name: label })}
              onClick={() => {
                update(chip.remove);
              }}
              className="rounded-chip bg-ink text-background flex h-11 items-center gap-1.5 px-3.5 text-sm font-medium whitespace-nowrap"
            >
              {label}
              <CloseIcon aria-hidden="true" className="size-4" />
            </button>
          </li>
        );
      })}
      <li className="shrink-0">
        <button
          type="button"
          onClick={() => {
            update(clearFilters);
          }}
          className="text-primary flex h-11 items-center px-2 text-sm font-semibold underline"
        >
          {t('discover.clearAll')}
        </button>
      </li>
    </ul>
  );
}
