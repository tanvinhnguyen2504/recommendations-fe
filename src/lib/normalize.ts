// Diacritic-insensitive VI matching, used for search and the add-a-place duplicate check.
//
// `đ` is a distinct letter rather than a base plus a combining mark, so NFD leaves it
// untouched and it needs an explicit replacement.
export function normalizeVi(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .trim();
}
