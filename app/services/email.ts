import { Resend } from 'resend';

import WelcomeEmail from '../../emails/WelcomeEmail';
import InactivityEmail from '../../emails/InactivityEmail';
import ProductUpdateEmail from '../../emails/ProductUpdateEmail';
import { OTPEmail } from '../../emails/OTPEmail';
import BetaInviteEmail from '../../emails/BetaInviteEmail';

const resend = new Resend(process.env.RESEND_API_KEY);
const isDevelopment = process.env.NODE_ENV !== 'production';
const devEmail = 'hth321@gmail.com';
const adminEmails = [
  'hunghero321@gmail.com',
  'hth321@gmail.com',
  'pvhieu30@gmail.com',
];

// New common function to send emails with retry logic
async function sendEmailWithRetry(
  emailOptions: {
    to: string;
    subject: string;
    react: React.ReactNode;
  },
  maxRetries = 3,
  initialDelay = 1000,
) {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      const { data, error } = await resend.emails.send({
        from: 'iTracksy <noreply@itracksy.com>',
        ...emailOptions,
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error: any) {
      if (error.statusCode === 429 && retries < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, retries);
        console.log(`Rate limit exceeded. Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        retries++;
      } else {
        throw error;
      }
    }
  }
}

export async function sendInactivityEmail(userEmail: string) {
  const toEmail = isDevelopment ? devEmail : userEmail;
  console.log('userEmail', userEmail);
  if (toEmail) {
    await sendEmailWithRetry({
      to: toEmail,
      subject: 'We miss you at iTracksy!',
      react: InactivityEmail({}),
    });

    if (isDevelopment) {
      throw new Error('Inactivity email sent successfully:');
    }
  }
}

export async function sendWelcomeEmail(
  userEmail?: string,
  userFirstName: string = 'there',
) {
  const toEmail = isDevelopment ? devEmail : userEmail;
  console.log('[sendWelcomeEmail] userEmail', userEmail);
  if (toEmail) {
    await sendEmailWithRetry({
      to: toEmail,
      subject: 'Welcome to iTracksy!',
      react: WelcomeEmail({ userFirstName }),
    });

    if (isDevelopment) {
      throw new Error('Welcome email sent successfully:');
    }
  }
}

export async function sendProductUpdateEmail(userEmail: string) {
  const toEmail = isDevelopment ? devEmail : userEmail;
  console.log('[sendProductUpdateEmail] userEmail', userEmail);
  if (toEmail) {
    await sendEmailWithRetry({
      to: toEmail,
      subject: 'Product Update',
      react: ProductUpdateEmail({}),
    });
  }
}

export async function sendOTPEmail(userEmail: string, otp: string) {
  try {
    if (userEmail) {
      await sendEmailWithRetry({
        to: userEmail,
        subject: 'Your iTracksy Login OTP',
        react: OTPEmail({ otp }),
      });
    }
  } catch (emailError) {
    console.error('Failed to send OTP email:', emailError);
  }
}

export async function sendBetaInviteEmail({
  userEmail,
  recipientName,
}: {
  userEmail: string;
  recipientName?: string;
}) {
  const toEmail = isDevelopment ? devEmail : userEmail;
  console.log('[sendBetaInviteEmail] userEmail', userEmail);

  try {
    if (toEmail) {
      await sendEmailWithRetry({
        to: toEmail,
        subject: 'Exclusive Invitation: Join the iTracksy Beta!',
        react: BetaInviteEmail({ recipientName }),
      });

      if (isDevelopment) {
        console.log(`Beta invitation email sent successfully to ${toEmail}`);
      }

      return { success: true };
    }
  } catch (emailError) {
    console.error('Failed to send beta invitation email:', emailError);
    return { success: false, error: emailError };
  }
}
