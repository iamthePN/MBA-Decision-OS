export async function summarizeRecommendation(text: string) {
  if (process.env.ENABLE_AI_SUMMARIES !== "true") {
    return text;
  }

  return text;
}
