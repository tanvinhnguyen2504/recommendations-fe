import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useLocale } from '@/hooks/useLocale';
import { formatDecimal, formatDistance, formatVnd } from '@/lib/format';
import { HeartIcon, StarIcon } from '@/lib/icons';
import { cn } from 'cn';
import { IPlace } from '@/types/place';
import PlaceStatus from './PlaceStatus';
import PriceLevel from './PriceLevel';

interface Props {
  place: IPlace;
  onToggleSave: (id: string) => void;
}

export default function PlaceCard({ place, onToggleSave }: Props) {
  const { t } = useTranslation();
  const locale = useLocale();
  const navigate = useNavigate();

  return (
    // The card is one button and the heart is a SIBLING stacked above it. Nesting a button
    // inside a button is invalid HTML and breaks keyboard and screen-reader behaviour.
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          navigate(`/place/${place.id}`);
        }}
        className="focus-visible:ring-ring block w-full text-left focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        <div className="rounded-card bg-surface-2 relative h-[156px] w-full overflow-hidden">
          {place.cover_photo_url !== undefined && (
            <img
              src={place.cover_photo_url}
              alt=""
              loading="lazy"
              className="size-full object-cover"
            />
          )}

          <div className="absolute top-3 left-3 flex gap-2">
            <span className="rounded-chip bg-surface/95 text-ink px-2.5 py-1 text-xs font-semibold">
              {place.category === 'food' ? t('place.food') : t('place.cafe')}
            </span>
            {place.status === 'pending' && (
              <span className="rounded-chip bg-tint text-tint-ink px-2.5 py-1 text-xs font-semibold">
                {t('place.pending')}
              </span>
            )}
          </div>

          {place.cover_caption !== undefined && (
            <p className="absolute bottom-2 left-3 line-clamp-1 pr-24 text-xs font-medium text-white drop-shadow">
              {place.cover_caption}
            </p>
          )}
        </div>

        <div className="mt-2.5 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate text-[17px] leading-tight font-bold">{place.name}</h3>
            <PriceLevel level={place.price_level} />
          </div>

          <p className="text-ink-2 flex items-center gap-1.5 text-sm">
            {place.rating === null ? (
              <span>{t('place.noRating')}</span>
            ) : (
              <>
                <StarIcon aria-hidden="true" className="fill-star text-star size-4" />
                <span className="text-ink font-semibold">
                  {formatDecimal(place.rating, locale)}
                </span>
                <span>{t('count.reviews', { count: place.review_count })}</span>
              </>
            )}
            <span aria-hidden="true">·</span>
            <span>{formatDistance(place.distance_m, locale)}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate">
              {t('place.perPerson', { price: formatVnd(place.avg_price_per_person, locale) })}
            </span>
          </p>

          <p className="text-ink-2 truncate text-sm">{place.street}</p>
          <PlaceStatus place={place} />
        </div>
      </button>

      <button
        type="button"
        aria-label={place.is_saved ? t('a11y.unsave') : t('a11y.save')}
        aria-pressed={place.is_saved}
        onClick={() => {
          onToggleSave(place.id);
        }}
        className="bg-surface/95 focus-visible:ring-ring absolute top-3 right-3 z-10 grid size-11 place-items-center rounded-full shadow-sm focus-visible:ring-2 focus-visible:outline-none"
      >
        <HeartIcon
          aria-hidden="true"
          className={cn('size-5', place.is_saved ? 'fill-primary text-primary' : 'text-ink')}
        />
      </button>
    </div>
  );
}

export function PlaceCardSkeleton() {
  return (
    <div aria-hidden="true" className="space-y-2.5">
      <div className="rounded-card bg-skel h-[156px] w-full" />
      <div className="bg-skel h-4 w-2/3 rounded" />
      <div className="bg-skel h-3.5 w-1/2 rounded" />
      <div className="bg-skel h-3.5 w-1/3 rounded" />
    </div>
  );
}
