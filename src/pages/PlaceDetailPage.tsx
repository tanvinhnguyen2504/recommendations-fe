import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import PlaceStatus from '@/components/discover/PlaceStatus';
import PriceLevel from '@/components/discover/PriceLevel';
import { usePlace } from '@/hooks/usePlaces';
import { useLocale } from '@/hooks/useLocale';
import { formatDecimal, formatDistance, formatVnd } from '@/lib/format';
import {
  BackIcon,
  CloseIcon,
  HeartIcon,
  ImageIcon,
  MenuDocIcon,
  NavigateIcon,
  PlayIcon,
  ShareIcon,
  StarIcon,
} from '@/lib/icons';
import { cn } from 'cn';
import { MediaCategory, MediaItem } from '@/types/place';

const MEDIA_TABS: { value: MediaCategory | 'all'; labelKey: string }[] = [
  { value: 'all', labelKey: 'media.tabAll' },
  { value: 'food', labelKey: 'media.tabFood' },
  { value: 'space', labelKey: 'media.tabSpace' },
  { value: 'menu', labelKey: 'media.tabMenu' },
  { value: 'video', labelKey: 'media.tabVideo' },
];

export default function PlaceDetailPage() {
  const { t } = useTranslation();
  const locale = useLocale();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const place = usePlace(id ?? '');

  const [tab, setTab] = useState<MediaCategory | 'all'>('all');
  const [saved, setSaved] = useState(false);
  const [lightbox, setLightbox] = useState<MediaItem | null>(null);

  useEffect(() => {
    if (place.data !== undefined) {
      setSaved(place.data.is_saved);
    }
  }, [place.data]);

  useEffect(() => {
    if (lightbox === null) {
      return;
    }

    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        setLightbox(null);
      }
    }

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [lightbox]);

  if (place.isPending) {
    return (
      <div aria-busy="true" className="space-y-3">
        <div className="bg-skel h-[248px] w-full" />
        <div className="space-y-2 px-4">
          <div className="bg-skel h-6 w-2/3 rounded" />
          <div className="bg-skel h-4 w-1/2 rounded" />
        </div>
      </div>
    );
  }

  if (place.isError || place.data === undefined) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="text-lg font-bold">{t('place.notFound')}</h1>
        <button
          type="button"
          onClick={() => {
            void navigate('/');
          }}
          className="border-line h-11 rounded-[14px] border px-4 font-semibold"
        >
          {t('common.back')}
        </button>
      </main>
    );
  }

  const data = place.data;
  const media = data.media.filter((item) => {
    return tab === 'all' || item.category === tab;
  });

  async function share(): Promise<void> {
    const url = window.location.href;

    // navigator.share is missing on desktop Safari and some in-app browsers, so never
    // render a button that silently does nothing — fall back to the clipboard.
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: data.name, url });
        return;
      } catch {
        return;
      }
    }

    await navigator.clipboard.writeText(url);
  }

  return (
    <main className="bg-background min-h-dvh pb-28">
      <div className="bg-surface-2 relative h-[248px] w-full overflow-hidden">
        {data.cover_photo_url !== undefined && (
          <img src={data.cover_photo_url} alt="" className="size-full object-cover" />
        )}

        <div
          className="absolute inset-x-3 flex items-center justify-between"
          style={{ top: 'max(0.75rem, env(safe-area-inset-top))' }}
        >
          <button
            type="button"
            aria-label={t('a11y.back')}
            onClick={() => {
              void navigate(-1);
            }}
            className="bg-surface/95 grid size-11 place-items-center rounded-full shadow-sm"
          >
            <BackIcon aria-hidden="true" className="size-5" />
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              aria-label={t('place.share')}
              onClick={() => {
                void share();
              }}
              className="bg-surface/95 grid size-11 place-items-center rounded-full shadow-sm"
            >
              <ShareIcon aria-hidden="true" className="size-5" />
            </button>
            <button
              type="button"
              aria-label={saved ? t('a11y.unsave') : t('a11y.save')}
              aria-pressed={saved}
              onClick={() => {
                setSaved((current) => {
                  return !current;
                });
              }}
              className="bg-surface/95 grid size-11 place-items-center rounded-full shadow-sm"
            >
              <HeartIcon
                aria-hidden="true"
                className={cn('size-5', saved ? 'fill-primary text-primary' : 'text-ink')}
              />
            </button>
          </div>
        </div>

        {data.cover_caption !== undefined && (
          <p className="absolute bottom-3 left-4 max-w-[55%] truncate text-sm font-medium text-white drop-shadow">
            {data.cover_caption}
          </p>
        )}

        {data.media.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setLightbox(data.media[0] ?? null);
            }}
            className="rounded-chip bg-surface/95 absolute right-4 bottom-3 flex h-11 items-center px-3.5 text-sm font-semibold"
          >
            {t('count.viewMedia', { count: data.media.length })}
          </button>
        )}
      </div>

      <section className="space-y-2 px-4 pt-4">
        <div className="flex gap-2">
          <span className="rounded-chip bg-surface-2 text-ink px-2.5 py-1 text-xs font-semibold">
            {data.category === 'food' ? t('place.food') : t('place.cafe')}
          </span>
          {data.status === 'pending' && (
            <span className="rounded-chip bg-tint text-tint-ink px-2.5 py-1 text-xs font-semibold">
              {t('place.pending')}
            </span>
          )}
        </div>

        <h1 className="text-2xl leading-tight font-extrabold">{data.name}</h1>

        <p className="text-ink-2 flex flex-wrap items-center gap-1.5 text-sm">
          {data.rating === null ? (
            <span>{t('place.noRating')}</span>
          ) : (
            <>
              <StarIcon aria-hidden="true" className="fill-star text-star size-4" />
              <span className="text-ink font-semibold">{formatDecimal(data.rating, locale)}</span>
              <span>{t('count.reviews', { count: data.review_count })}</span>
            </>
          )}
          <span aria-hidden="true">·</span>
          <span>{formatDistance(data.distance_m, locale)}</span>
          <span aria-hidden="true">·</span>
          <PriceLevel level={data.price_level} />
        </p>

        <p className="text-ink-2 text-sm">
          {data.address}, {data.district} ·{' '}
          {t('place.perPerson', { price: formatVnd(data.avg_price_per_person, locale) })}
        </p>

        <PlaceStatus place={data} />

        {data.tags.length > 0 && (
          <ul className="flex flex-wrap gap-2 pt-1">
            {data.tags.map((tag) => {
              return (
                <li
                  key={tag}
                  className="rounded-chip bg-surface-2 text-ink-2 px-3 py-1.5 text-xs font-medium"
                >
                  {t(`tag.${tag}`)}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="px-4 pt-6">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-base font-bold">
            {t('count.mediaTitle', { count: data.media.length })}
          </h2>
          <label className="text-primary flex h-11 cursor-pointer items-center text-sm font-semibold">
            {t('media.add')}
            <input type="file" accept="image/*,video/*" multiple className="sr-only" />
          </label>
        </div>

        {data.media.length === 0 ? (
          <p className="text-ink-2 bg-surface-2 rounded-card px-4 py-6 text-center text-sm">
            {t('media.empty')}
          </p>
        ) : (
          <>
            <div
              role="tablist"
              className="mb-3 flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {MEDIA_TABS.map(({ value, labelKey }) => {
                const count =
                  value === 'all'
                    ? data.media.length
                    : data.media.filter((item) => {
                        return item.category === value;
                      }).length;

                if (count === 0) {
                  return null;
                }

                const active = tab === value;

                return (
                  <button
                    key={value}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => {
                      setTab(value);
                    }}
                    className={cn(
                      'rounded-chip h-11 shrink-0 border px-3.5 text-sm font-medium whitespace-nowrap',
                      active ? 'border-primary bg-tint text-tint-ink' : 'border-line',
                    )}
                  >
                    {t(labelKey)} · {count}
                  </button>
                );
              })}
            </div>

            {/* The first tile spans 2x2 only from 3 items up — with 1 or 2 it would leave
                holes in the grid. */}
            <ul className="grid grid-cols-3 gap-1 [grid-auto-rows:116px]">
              {media.map((item, index) => {
                const featured = index === 0 && media.length >= 3;

                return (
                  <li key={item.id} className={cn(featured && 'col-span-2 row-span-2')}>
                    <button
                      type="button"
                      onClick={() => {
                        setLightbox(item);
                      }}
                      className="bg-surface-2 relative block size-full overflow-hidden rounded-md"
                    >
                      <img
                        src={item.url}
                        alt={item.caption}
                        loading="lazy"
                        className="size-full object-cover"
                      />

                      {item.is_video && (
                        <>
                          <span className="absolute inset-0 grid place-items-center">
                            <span className="grid size-10 place-items-center rounded-full bg-black/55">
                              <PlayIcon aria-hidden="true" className="size-5 text-white" />
                            </span>
                          </span>
                          {item.duration_sec !== undefined && (
                            <span className="absolute right-1.5 bottom-1.5 rounded bg-black/65 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                              0:{String(item.duration_sec).padStart(2, '0')}
                            </span>
                          )}
                        </>
                      )}

                      {item.category === 'menu' && (
                        <span className="absolute top-1.5 left-1.5 grid size-7 place-items-center rounded-full bg-black/55">
                          <MenuDocIcon aria-hidden="true" className="size-4 text-white" />
                        </span>
                      )}

                      <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/70 to-transparent px-2 pt-4 pb-1 text-left text-[11px] font-medium text-white">
                        {item.caption}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </section>

      <div
        className="bg-surface border-line fixed inset-x-0 bottom-0 z-30 mx-auto flex max-w-[480px] gap-2 border-t px-4 pt-3"
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      >
        <button
          type="button"
          aria-pressed={saved}
          onClick={() => {
            setSaved((current) => {
              return !current;
            });
          }}
          className="border-line flex h-12 flex-1 items-center justify-center gap-2 rounded-[14px] border text-sm font-semibold"
        >
          <HeartIcon
            aria-hidden="true"
            className={cn('size-5', saved ? 'fill-primary text-primary' : '')}
          />
          {saved ? t('place.saved') : t('place.save')}
        </button>

        {/* The universal Google Maps intent: hands off to the native app on Android and
            iOS, opens the web map elsewhere. No SDK and no API key in R1. */}
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${data.lat},${data.lng}`}
          target="_blank"
          rel="noreferrer"
          className="bg-primary text-primary-foreground flex h-12 flex-1 items-center justify-center gap-2 rounded-[14px] text-sm font-bold"
        >
          <NavigateIcon aria-hidden="true" className="size-5" />
          {t('place.directions')}
        </a>
      </div>

      {lightbox !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.caption}
          className="fixed inset-0 z-50 flex flex-col bg-[#0F0B09]"
        >
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm font-semibold text-white">
              {t('media.counter', {
                current: data.media.indexOf(lightbox) + 1,
                total: data.media.length,
              })}
            </span>
            <button
              type="button"
              aria-label={t('common.close')}
              onClick={() => {
                setLightbox(null);
              }}
              className="grid size-11 place-items-center rounded-full text-white"
            >
              <CloseIcon aria-hidden="true" className="size-6" />
            </button>
          </div>

          <div className="flex min-h-0 flex-1 items-center justify-center px-2">
            <img
              src={lightbox.url}
              alt={lightbox.caption}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          <p className="flex items-center gap-2 px-4 py-4 text-sm text-white/80">
            <ImageIcon aria-hidden="true" className="size-4 shrink-0" />
            {lightbox.caption}
          </p>
        </div>
      )}
    </main>
  );
}
