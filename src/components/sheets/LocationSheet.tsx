import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import BottomSheet from '@/components/BottomSheet';
import { PlaceAPI } from '@/api/placesAPI';
import { useLocationSearch } from '@/hooks/usePlaces';
import { CheckIcon, ChevronRightIcon, ClockIcon, LocateIcon, SearchIcon } from '@/lib/icons';
import { AREAS, STREETS, WARDS } from '@/mocks/places';
import { cn } from 'cn';
import { LocationSelection } from '@/types/place';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (selection: { area_id?: string; ward_id?: string; street_id?: string }) => void;
  /** Only true when the sheet was opened from search — see the autofocus note below. */
  autoFocusSearch?: boolean;
}

interface Draft {
  area_id?: string;
  ward_id?: string;
  street_id?: string;
}

const RECENTS_KEY = 'recentLocations';

function readRecents(): LocationSelection[] {
  try {
    const raw = localStorage.getItem(RECENTS_KEY);
    return raw === null ? [] : (JSON.parse(raw) as LocationSelection[]);
  } catch {
    return [];
  }
}

function labelFor(draft: Draft): string {
  const area = AREAS.find((candidate) => {
    return candidate.id === draft.area_id;
  });
  const ward = WARDS.find((candidate) => {
    return candidate.id === draft.ward_id;
  });
  const street = STREETS.find((candidate) => {
    return candidate.id === draft.street_id;
  });

  return [area?.name, ward?.name, street?.name]
    .filter((part) => {
      return part !== undefined;
    })
    .join(' › ');
}

function rememberRecent(selection: LocationSelection): void {
  const existing = readRecents().filter((entry) => {
    return entry.label !== selection.label;
  });

  localStorage.setItem(RECENTS_KEY, JSON.stringify([selection, ...existing].slice(0, 5)));
}

export default function LocationSheet({ open, onOpenChange, onApply, autoFocusSearch }: Props) {
  const { t } = useTranslation();
  const [term, setTerm] = useState('');
  const [draft, setDraft] = useState<Draft>({});
  const [level, setLevel] = useState<1 | 2 | 3>(1);
  const [locating, setLocating] = useState(false);
  const [locateError, setLocateError] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const hits = useLocationSearch(term);
  const searching = term.trim() !== '';
  const recents = readRecents();

  // Autofocus ONLY when opened from search. Opening from the location chip must show the
  // cascade first, otherwise the keyboard immediately covers the list.
  useEffect(() => {
    if (open && autoFocusSearch === true) {
      searchRef.current?.focus();
    }
  }, [open, autoFocusSearch]);

  useEffect(() => {
    if (!open) {
      setTerm('');
      setLocateError(false);
    }
  }, [open]);

  function selectArea(area_id: string): void {
    // Choosing a level clears the deeper ones, or the query ends up with a street in the
    // wrong ward.
    setDraft({ area_id });
    setLevel(2);
    setTerm('');
  }

  function selectWard(ward_id: string, area_id: string): void {
    setDraft({ area_id, ward_id });
    setLevel(3);
    setTerm('');
  }

  function selectStreet(street_id: string, ward_id: string, area_id: string): void {
    setDraft({ area_id, ward_id, street_id });
    setTerm('');
  }

  function useCurrentLocation(): void {
    // Geolocation needs HTTPS and must only ever fire on a tap, never on mount.
    setLocating(true);
    setLocateError(false);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        void PlaceAPI.reverseGeocode(position.coords.latitude, position.coords.longitude).then(
          (hit) => {
            setDraft(hit);
            setLevel(3);
            setLocating(false);
          },
        );
      },
      () => {
        // Denied, unavailable and timeout all land here: fall back to the cascade with a
        // message rather than leaving a dead sheet.
        setLocating(false);
        setLocateError(true);
      },
      { timeout: 8000 },
    );
  }

  function apply(): void {
    const label = labelFor(draft);
    if (label !== '') {
      rememberRecent({ ...draft, label });
    }
    onApply(draft);
    onOpenChange(false);
  }

  const wards = WARDS.filter((ward) => {
    return ward.area_id === draft.area_id;
  });
  const streets = STREETS.filter((street) => {
    return street.ward_id === draft.ward_id;
  });

  const tabs: { value: 1 | 2 | 3; labelKey: string; enabled: boolean }[] = [
    { value: 1, labelKey: 'location.level1', enabled: true },
    { value: 2, labelKey: 'location.level2', enabled: draft.area_id !== undefined },
    { value: 3, labelKey: 'location.level3', enabled: draft.ward_id !== undefined },
  ];

  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      title={t('location.title')}
      heightClassName="h-[91dvh] max-h-[91dvh]"
      footer={
        <button
          type="button"
          onClick={apply}
          disabled={draft.area_id === undefined}
          className="bg-primary text-primary-foreground disabled:bg-surface-2 disabled:text-ink-3 h-12 w-full rounded-[14px] text-sm font-bold"
        >
          {t('location.seePlaces')}
        </button>
      }
    >
      <div className="space-y-3 px-4 py-3">
        <label className="relative block">
          <span className="sr-only">{t('location.searchPlaceholder')}</span>
          <SearchIcon
            aria-hidden="true"
            className="text-ink-2 pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2"
          />
          <input
            ref={searchRef}
            type="search"
            value={term}
            onChange={(event) => {
              setTerm(event.target.value);
            }}
            placeholder={t('location.searchPlaceholder')}
            className="bg-surface-2 placeholder:text-ink-2 h-[46px] w-full rounded-[14px] pr-3 pl-10"
          />
        </label>
        <p className="text-ink-2 text-xs">{t('location.searchHint')}</p>

        <button
          type="button"
          onClick={useCurrentLocation}
          className="bg-tint text-tint-ink flex h-11 w-full items-center justify-center gap-2 rounded-[14px] text-sm font-semibold"
        >
          <LocateIcon aria-hidden="true" className="size-5" />
          {locating ? t('location.locating') : t('location.useCurrent')}
        </button>
        {locateError && (
          <p role="alert" className="text-ink-2 text-xs">
            {t('location.locateDenied')}
          </p>
        )}

        {recents.length > 0 && !searching && (
          <div>
            <p className="text-ink-2 mb-2 text-xs font-semibold">{t('location.recent')}</p>
            <ul className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {recents.map((recent) => {
                return (
                  <li key={recent.label} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setDraft({
                          area_id: recent.area_id,
                          ward_id: recent.ward_id,
                          street_id: recent.street_id,
                        });
                        setLevel(3);
                      }}
                      className="rounded-chip border-line bg-surface flex h-11 items-center gap-1.5 border px-3.5 text-sm whitespace-nowrap"
                    >
                      <ClockIcon aria-hidden="true" className="text-ink-2 size-4" />
                      {recent.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {searching ? (
        <ul className="border-line border-t">
          {(hits.data ?? []).map((hit) => {
            if (hit.kind === 'area') {
              return (
                <li key={`a-${hit.area.id}`}>
                  <button
                    type="button"
                    onClick={() => {
                      selectArea(hit.area.id);
                    }}
                    className="border-line flex min-h-14 w-full items-center justify-between gap-2 border-b px-4 py-2 text-left"
                  >
                    <span className="text-sm font-semibold">{hit.area.name}</span>
                    <ChevronRightIcon aria-hidden="true" className="text-ink-2 size-5 shrink-0" />
                  </button>
                </li>
              );
            }

            if (hit.kind === 'ward') {
              return (
                <li key={`w-${hit.ward.id}`}>
                  <button
                    type="button"
                    onClick={() => {
                      selectWard(hit.ward.id, hit.area.id);
                    }}
                    className="border-line flex min-h-14 w-full items-center justify-between gap-2 border-b px-4 py-2 text-left"
                  >
                    <span className="min-w-0">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-sm font-semibold">{hit.ward.name}</span>
                        {/* The badge explains WHY an unfamiliar ward matched what was typed. */}
                        {hit.matched_old_name && (
                          <span className="rounded-chip bg-open-tint text-open shrink-0 px-2 py-0.5 text-[11px] font-bold">
                            {t('location.newNameBadge')}
                          </span>
                        )}
                      </span>
                      {hit.ward.old_name !== undefined && (
                        <span className="text-ink-2 block truncate text-xs">
                          {t('location.oldName', { name: hit.ward.old_name })} · {hit.area.name}
                        </span>
                      )}
                    </span>
                    <ChevronRightIcon aria-hidden="true" className="text-ink-2 size-5 shrink-0" />
                  </button>
                </li>
              );
            }

            return (
              <li key={`s-${hit.street.id}`}>
                <button
                  type="button"
                  onClick={() => {
                    selectStreet(hit.street.id, hit.ward.id, hit.area.id);
                  }}
                  className="border-line flex min-h-14 w-full items-center justify-between gap-2 border-b px-4 py-2 text-left"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">{hit.street.name}</span>
                    <span className="text-ink-2 block truncate text-xs">
                      {hit.ward.name} · {hit.area.name}
                    </span>
                  </span>
                  <ChevronRightIcon aria-hidden="true" className="text-ink-2 size-5 shrink-0" />
                </button>
              </li>
            );
          })}
          {hits.data !== undefined && hits.data.length === 0 && (
            <li className="text-ink-2 px-4 py-6 text-center text-sm">{t('location.noMatches')}</li>
          )}
        </ul>
      ) : (
        <>
          {draft.area_id !== undefined && (
            <nav className="text-ink-2 flex items-center gap-1 px-4 pb-2 text-xs">
              {labelFor(draft)
                .split(' › ')
                .map((crumb, index) => {
                  return (
                    <span key={crumb} className="flex items-center gap-1">
                      {index > 0 && <span aria-hidden="true">›</span>}
                      <button
                        type="button"
                        onClick={() => {
                          setLevel((index + 1) as 1 | 2 | 3);
                        }}
                        className="underline"
                      >
                        {crumb}
                      </button>
                    </span>
                  );
                })}
            </nav>
          )}

          <div role="tablist" className="border-line flex border-y">
            {tabs.map((tab) => {
              const active = level === tab.value;

              return (
                <button
                  key={tab.value}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  disabled={!tab.enabled}
                  onClick={() => {
                    setLevel(tab.value);
                  }}
                  className={cn(
                    'flex h-12 flex-1 items-center justify-center gap-1.5 border-b-2 text-sm font-semibold',
                    active ? 'border-primary text-ink' : 'border-transparent text-ink-2',
                    !tab.enabled && 'text-ink-3',
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'grid size-5 place-items-center rounded-full text-[11px] font-bold',
                      active ? 'bg-primary text-primary-foreground' : 'bg-surface-2 text-ink-2',
                    )}
                  >
                    {tab.value}
                  </span>
                  {t(tab.labelKey)}
                </button>
              );
            })}
          </div>

          <p className="text-ink-2 px-4 py-2 text-xs">{t(`location.level${level}Hint`)}</p>

          <ul>
            {level === 1 &&
              AREAS.map((area) => {
                const active = draft.area_id === area.id;

                return (
                  <li key={area.id}>
                    <button
                      type="button"
                      onClick={() => {
                        selectArea(area.id);
                      }}
                      className={cn(
                        'border-line flex min-h-14 w-full items-center justify-between gap-2 border-b px-4 py-2 text-left',
                        active && 'bg-tint',
                      )}
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold">{area.name}</span>
                        <span className="text-ink-2 block truncate text-xs">
                          {t('count.wards', { count: area.ward_count })}
                        </span>
                      </span>
                      {active ? (
                        <CheckIcon aria-hidden="true" className="text-tint-ink size-5 shrink-0" />
                      ) : (
                        <ChevronRightIcon
                          aria-hidden="true"
                          className="text-ink-2 size-5 shrink-0"
                        />
                      )}
                    </button>
                  </li>
                );
              })}

            {level === 2 &&
              wards.map((ward) => {
                const active = draft.ward_id === ward.id;

                return (
                  <li key={ward.id}>
                    <button
                      type="button"
                      onClick={() => {
                        selectWard(ward.id, ward.area_id);
                      }}
                      className={cn(
                        'border-line flex min-h-14 w-full items-center justify-between gap-2 border-b px-4 py-2 text-left',
                        active && 'bg-tint',
                      )}
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold">{ward.name}</span>
                        {ward.old_name !== undefined && (
                          <span className="text-ink-2 block truncate text-xs">
                            {t('location.oldName', { name: ward.old_name })}
                          </span>
                        )}
                      </span>
                      {active ? (
                        <CheckIcon aria-hidden="true" className="text-tint-ink size-5 shrink-0" />
                      ) : (
                        <ChevronRightIcon
                          aria-hidden="true"
                          className="text-ink-2 size-5 shrink-0"
                        />
                      )}
                    </button>
                  </li>
                );
              })}

            {level === 3 &&
              streets.map((street) => {
                const active = draft.street_id === street.id;

                return (
                  <li key={street.id}>
                    <button
                      type="button"
                      onClick={() => {
                        selectStreet(street.id, street.ward_id, draft.area_id ?? '');
                      }}
                      className={cn(
                        'border-line flex min-h-14 w-full items-center justify-between gap-2 border-b px-4 py-2 text-left',
                        active && 'bg-tint',
                      )}
                    >
                      <span className="truncate text-sm font-semibold">{street.name}</span>
                      {active && (
                        <CheckIcon aria-hidden="true" className="text-tint-ink size-5 shrink-0" />
                      )}
                    </button>
                  </li>
                );
              })}
          </ul>
        </>
      )}
    </BottomSheet>
  );
}
