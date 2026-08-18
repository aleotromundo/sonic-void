export function getLiveSearchQuery(term: string, submitted: string): string | null {
  const clean = term.trim().replace(/\s+/g, " ");
  if (clean.length < 2 || clean === submitted) return null;
  return clean;
}
