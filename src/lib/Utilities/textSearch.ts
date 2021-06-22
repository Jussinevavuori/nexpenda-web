/**
 * Searches text
 */
export function textSearch(search: string, ...match: string[]) {
  const searchTerm = search.toLowerCase();
  return match.some((matchable) => {
    return matchable.toLowerCase().includes(searchTerm);
  });
}
