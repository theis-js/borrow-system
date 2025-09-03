export const formatDateTime = (value: string | null | undefined) => {
  if (!value) return "N/A";
  const m = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!m) return "N/A";
  const [, y, M, d, h, min] = m;
  return `${d}.${M}.${y} ${h}:${min} Uhr`;
};
