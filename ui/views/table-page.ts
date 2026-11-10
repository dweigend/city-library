/** Presentation paging only: complete model rows remain untouched. */
export const tablePageSize = 200;

export function tablePage<T>(rows: readonly T[], requestedPage: number) {
  const lastPage = Math.max(0, Math.ceil(rows.length / tablePageSize) - 1);
  const page = Math.max(0, Math.min(requestedPage, lastPage));
  const start = page * tablePageSize;
  const end = Math.min(start + tablePageSize, rows.length);
  return {
    page,
    rows: rows.slice(start, end),
    previous: page > 0,
    next: page < lastPage,
    paged: rows.length > tablePageSize,
    range: rows.length ? `${start + 1}–${end} of ${rows.length}` : "No rows",
  };
}
