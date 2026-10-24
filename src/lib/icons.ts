// Every icon the UI uses, named for its role rather than its glyph. Centralised so the
// icon set can be swapped in one file, and so tree-shaking sees a single import site.
//
// All are 24px stroke icons with round caps. No emoji is ever used in the UI.
export {
  ArrowLeft as BackIcon,
  Bookmark as BookmarkIcon,
  Check as CheckIcon,
  ChevronDown as ChevronDownIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Clock as ClockIcon,
  Compass as CompassIcon,
  Dices as DiceIcon,
  FileText as MenuDocIcon,
  Heart as HeartIcon,
  Image as ImageIcon,
  LayoutGrid as GridIcon,
  LocateFixed as LocateIcon,
  Map as MapIcon,
  MapPin as PinIcon,
  Navigation as NavigateIcon,
  Play as PlayIcon,
  Plus as PlusIcon,
  Rows3 as CardsIcon,
  Search as SearchIcon,
  Share2 as ShareIcon,
  SlidersHorizontal as SlidersIcon,
  Star as StarIcon,
  Table as TableIcon,
  User as UserIcon,
  X as CloseIcon,
} from 'lucide-react';
