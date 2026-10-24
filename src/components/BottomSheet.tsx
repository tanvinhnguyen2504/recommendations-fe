import { ReactNode } from 'react';

import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer';
import { CloseIcon } from '@/lib/icons';
import { useTranslation } from 'react-i18next';
import { cn } from 'cn';

interface Props {
  open: boolean;
  title: string;
  /** Rendered next to the title — the filter sheet's "N đang chọn", for example. */
  titleAside?: ReactNode;
  footer?: ReactNode;
  /** The design gives each sheet a fixed height; default is content height. */
  heightClassName?: string;
  children: ReactNode;
  onOpenChange: (open: boolean) => void;
}

// Every panel in the app is one of these: drag handle, scrim that closes on tap, trapped
// focus, scroll-locked body. vaul supplies the drag, dismiss and scroll lock; the ARIA
// comes from the underlying dialog.
export default function BottomSheet({
  open,
  title,
  titleAside,
  footer,
  heightClassName,
  children,
  onOpenChange,
}: Props) {
  const { t } = useTranslation();

  return (
    <Drawer open={open} onOpenChange={onOpenChange} repositionInputs>
      <DrawerContent
        className={cn('mx-auto max-w-[480px] md:max-w-[480px]', heightClassName)}
        aria-modal="true"
      >
        <div className="border-line flex items-center gap-2 border-b px-4 py-3">
          <DrawerTitle className="flex-1 truncate text-base font-bold">{title}</DrawerTitle>
          {titleAside}
          <button
            type="button"
            aria-label={t('common.close')}
            onClick={() => {
              onOpenChange(false);
            }}
            className="text-ink -mr-2 grid size-11 shrink-0 place-items-center rounded-full"
          >
            <CloseIcon aria-hidden="true" className="size-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>

        {footer !== undefined && (
          <div
            className="border-line bg-surface border-t px-4 pt-3"
            style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
          >
            {footer}
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}

/** Shared chip used across the filter and location sheets. */
export function SheetChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'rounded-chip flex h-11 items-center gap-1.5 border px-3.5 text-sm font-medium',
        active ? 'border-primary bg-tint text-tint-ink' : 'border-line bg-surface text-ink',
      )}
    >
      {children}
    </button>
  );
}
