export const formatDateTime = (value: string | null | undefined) => {
  if (!value) return "N/A";
  const inpDate = new Date(value);
  if (isNaN(inpDate.getTime())) return "N/A";
  return (
    inpDate.toLocaleString(undefined, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }) + " Uhr"
  );
};
