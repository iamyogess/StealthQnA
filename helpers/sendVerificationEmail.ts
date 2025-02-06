import VerificationEmail from "@/emails/VerificationEmail";
import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Stealth Chat Verification Code",
      react: VerificationEmail({ username, verifyCode }),
    });
    return { success: true, message: "Verification email sent!" };
  } catch (error) {
    console.error("Error sending verification error!", error);
    return { success: false, message: "Failed to send verification email!" };
  }
}
