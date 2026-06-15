"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpEmailTemplate = otpEmailTemplate;
function otpEmailTemplate(otp, purpose, expiryMinutes) {
    var _a;
    var purposeLabel = {
        REGISTRATION: 'account verification',
        LOGIN: 'login',
        FORGOT_PASSWORD: 'password reset',
        CHANGE_PASSWORD: 'password change',
    };
    var label = (_a = purposeLabel[purpose]) !== null && _a !== void 0 ? _a : purpose.toLowerCase().replace('_', ' ');
    return "\n    <!DOCTYPE html>\n    <html>\n      <body style=\"font-family: Arial, sans-serif; background: #f5f5f5; padding: 32px;\">\n        <div style=\"max-width: 480px; margin: 0 auto; background: #fff; border-radius: 8px; padding: 32px;\">\n          <h2 style=\"color: #1a1a1a; margin-bottom: 8px;\">Your verification code</h2>\n          <p style=\"color: #555; margin-bottom: 24px;\">\n            Use this code to complete your ".concat(label, ".\n          </p>\n          <div style=\"font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #1a1a1a;\n                      background: #f0f0f0; border-radius: 6px; padding: 16px; text-align: center;\">\n            ").concat(otp, "\n          </div>\n          <p style=\"color: #888; font-size: 13px; margin-top: 24px;\">\n            This code expires in <strong>").concat(expiryMinutes, " minutes</strong>.\n            Do not share it with anyone.\n          </p>\n          <hr style=\"border: none; border-top: 1px solid #eee; margin: 24px 0;\" />\n          <p style=\"color: #bbb; font-size: 12px;\">\n            If you didn't request this, you can safely ignore this email.\n          </p>\n        </div>\n      </body>\n    </html>\n  ");
}
