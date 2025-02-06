import React from "react";

interface EmailTemplateProps {
  username: string;
  verifyCode: string;
}

export default function VerificationEmail({
  username,
  verifyCode,
}: EmailTemplateProps) {
  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-6">
      <div className="bg-blue-50 p-4 rounded-t-lg">
        <h1 className="text-2xl font-bold text-blue-800 text-center">
          Verify Your Email
        </h1>
      </div>
      <div className="p-6 text-center">
        <p className="text-lg mb-4">
          Hi <span className="font-semibold text-blue-600">{username}</span>,
        </p>
        <p className="mb-6 text-gray-700">
          To complete your account setup, please use the verification code
          below:
        </p>
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <code className="text-3xl font-bold text-blue-700 tracking-widest">
            {verifyCode}
          </code>
        </div>
        <p className="text-sm text-gray-500">
          This code will expire in 15 minutes.
        </p>
      </div>
      <div className="bg-gray-50 p-4 text-center text-xs text-gray-500">
        If you didn&apos;t request this verification, please ignore this email.
      </div>
    </div>
  );
}
