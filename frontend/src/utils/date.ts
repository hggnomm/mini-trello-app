export function formatDate(date: string | Date | null | undefined, locale = "en-US"): string | null {
  if (!date) return null;

  return new Date(date).toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
