export function otpEmailTemplate(otp: string, purpose: string, expiryMinutes: number): string {
  const purposeLabel: Record<string, string> = {
    REGISTRATION: 'account verification',
    LOGIN: 'login',
    FORGOT_PASSWORD: 'password reset',
    CHANGE_PASSWORD: 'password change',
  };

  const label = purposeLabel[purpose] ?? purpose.toLowerCase().replace('_', ' ');

  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: Arial, sans-serif; background: #f5f5f5; padding: 32px;">
        <div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 8px; padding: 32px;">
          <h2 style="color: #1a1a1a; margin-bottom: 8px;">Your verification code</h2>
          <p style="color: #555; margin-bottom: 24px;">
            Use this code to complete your ${label}.
          </p>
          <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #1a1a1a;
                      background: #f0f0f0; border-radius: 6px; padding: 16px; text-align: center;">
            ${otp}
          </div>
          <p style="color: #888; font-size: 13px; margin-top: 24px;">
            This code expires in <strong>${expiryMinutes} minutes</strong>.
            Do not share it with anyone.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="color: #bbb; font-size: 12px;">
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      </body>
    </html>
  `;
}