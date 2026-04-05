export function sanitizeText(input: string) {
  return input.replace(/<[^>]*>/g, "").trim();
}

export function sanitizeStringArray(input: string[]) {
  return input.map((value) => sanitizeText(value)).filter(Boolean);
}
