import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export const EMAIL_FROM = process.env.RESEND_FROM_EMAIL ?? "PromptVault <onboarding@resend.dev>";

function teamShareEmailHtml(opts: {
  sharedByName: string;
  promptTitle: string;
  promptUrl: string;
}) {
  return `
  <div style="background:#0b0b12;padding:32px;font-family:Inter,ui-sans-serif,sans-serif;color:#f4f4f6;">
    <div style="max-width:480px;margin:0 auto;background:#17131f;border:1px solid #2a2a3a;border-radius:12px;padding:32px;">
      <p style="font-size:13px;color:#9a9ab0;margin:0 0 12px;letter-spacing:.02em;">PROMPTVAULT</p>
      <h1 style="font-size:20px;margin:0 0 16px;font-family:'Space Grotesk',ui-sans-serif,sans-serif;">
        ${opts.sharedByName} shared a prompt with the team
      </h1>
      <p style="font-size:14px;line-height:1.6;color:#c9c9d6;margin:0 0 24px;">
        <strong style="color:#f4f4f6;">${opts.promptTitle}</strong> is now visible to everyone on your team.
      </p>
      <a href="${opts.promptUrl}"
         style="display:inline-block;background:#8b5cf6;color:#fff;text-decoration:none;padding:10px 18px;border-radius:8px;font-size:14px;font-weight:500;">
        View prompt
      </a>
    </div>
  </div>`;
}

export async function sendTeamShareNotification(opts: {
  sharedByName: string;
  promptTitle: string;
  promptUrl: string;
  recipientEmails: string[];
}) {
  const recipients = opts.recipientEmails.filter(Boolean);
  if (recipients.length === 0 || !process.env.RESEND_API_KEY) return;

  const html = teamShareEmailHtml(opts);

  await resend.batch.send(
    recipients.map((email) => ({
      from: EMAIL_FROM,
      to: [email],
      subject: `${opts.sharedByName} shared "${opts.promptTitle}" with the team`,
      html,
    })),
  );
}
