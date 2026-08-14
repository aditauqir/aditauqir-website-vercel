import { NextResponse } from "next/server";
import { EmailParams, MailerSend, Recipient, Sender } from "mailersend";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function POST(request: Request) {
  try {
    const { message } = (await request.json()) as { message?: string };
    const trimmedMessage = message?.trim();

    if (!trimmedMessage) {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.MAILERSEND_API_KEY;
    const fromEmail = process.env.MAILERSEND_FROM_EMAIL;
    const fromName = process.env.MAILERSEND_FROM_NAME ?? "Adi Tauqir";
    const toEmail = process.env.MAILERSEND_TO_EMAIL ?? "aditauqir@gmail.com";

    if (!apiKey || !fromEmail || fromEmail === "info@your-verified-domain.com") {
      return NextResponse.json(
        { error: "MailerSend sender configuration is incomplete." },
        { status: 500 }
      );
    }

    const mailerSend = new MailerSend({ apiKey });

    const sentFrom = new Sender(fromEmail, fromName);
    const recipients = [new Recipient(toEmail, "Adi Tauqir")];
    const escapedMessage = escapeHtml(trimmedMessage);

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject("Website message")
      .setText(trimmedMessage)
      .setHtml(
        `<p>Message from aditauqir.com:</p><p>${escapedMessage.replaceAll(
          "\n",
          "<br />"
        )}</p>`
      );

    await mailerSend.email.send(emailParams);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Unable to send message." },
      { status: 500 }
    );
  }
}
