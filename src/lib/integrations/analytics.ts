export function trackEvent(name: string, properties: Record<string, string | number | boolean>) {
  if (process.env.ENABLE_ANALYTICS !== "true") {
    return;
  }

  console.info("[analytics]", name, properties);
}
