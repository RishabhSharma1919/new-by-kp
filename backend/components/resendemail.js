import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail() {
  try {
    const response = await resend.emails.send({
      from: 'yourname@onresend.com',  // Use onresend.com domain
      to: 'recipient@example.com',
      subject: 'Test Email',
      html: '<strong>Hello, this is a test email!</strong>',
    });
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

sendEmail();
