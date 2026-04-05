export function toCsv<T extends Record<string, string | number | null | undefined>>(rows: T[]) {
  if (!rows.length) {
    return "";
  }

  const headers = Object.keys(rows[0]);
  const escape = (value: string | number | null | undefined) =>
    `"${String(value ?? "").replaceAll('"', '""')}"`;

  const body = rows.map((row) => headers.map((header) => escape(row[header])).join(",")).join("\n");
  return `${headers.join(",")}\n${body}`;
}
