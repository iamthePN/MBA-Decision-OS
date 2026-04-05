type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail(payload: EmailPayload) {
  if (process.env.ENABLE_EMAIL_NOTIFICATIONS !== "true") {
    console.info("[email-disabled]", payload.subject);
    return { delivered: false, provider: "disabled" };
  }

  const provider = process.env.EMAIL_PROVIDER ?? "console";

  if (provider === "console") {
    console.info("[email-console]", payload);
    return { delivered: true, provider };
  }

  return { delivered: false, provider };
}
