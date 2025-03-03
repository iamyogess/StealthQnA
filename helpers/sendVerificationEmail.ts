import VerificationEmail from "@/emails/VerificationEmail";
import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  username: string,
  email: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    console.log("email verification", username, email);
    await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: [email], // Resend expects an array of recipients
      subject: "Stealth Chat Verification Code",
      react: VerificationEmail({ username, verifyCode }),
    });
    return { success: true, message: "Verification email sent!" };
  } catch (error) {
    console.error("Error sending verification email!", error);
    return { success: false, message: "Failed to send verification email!" };
  }
}
