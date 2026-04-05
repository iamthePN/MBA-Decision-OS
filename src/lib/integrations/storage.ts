export async function uploadNoteAttachment() {
  if (process.env.ENABLE_FILE_STORAGE !== "true") {
    return { enabled: false };
  }

  return { enabled: true };
}
