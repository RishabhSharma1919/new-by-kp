import { Resend } from 'resend';

const resend = new Resend('YOUR_RESEND_API_KEY'); // Replace with your API key

export const sendVerificationEmail = async (email, verificationCode) => {
  try {
    const response = await resend.emails.send({
      from: 'YourApp <no-reply@yourdomain.com>', // Use a verified domain email
      to: email,
      subject: 'Your Verification Code',
      html: `<p>Your verification code is: <strong>${verificationCode}</strong></p>`,
    });

    console.log("Email sent successfully:", response);
    return { success: true, message: 'Verification email sent!' };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: 'Failed to send email' };
  }
};
