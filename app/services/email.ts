import { Resend } from 'resend';
import React from 'react';

import WelcomeEmail from '../../emails/WelcomeEmail';
import InactivityEmail from '../../emails/InactivityEmail';
import ProductUpdateEmail from '../../emails/ProductUpdateEmail';
import { OTPEmail } from '../../emails/OTPEmail';
import FeedbackNotificationEmail from '../../emails/FeedbackNotificationEmail';
import FeedbackReplyEmail from '../../emails/FeedbackReplyEmail';

const resend = new Resend(process.env.RESEND_BUDDYBEEP_API_KEY);
const isDevelopment = process.env.NODE_ENV !== 'production';
const devEmail = 'hth321@gmail.com';

// New common function to send emails with retry logic
async function sendEmailWithRetry(
  emailOptions: {
    to: string;
    subject: string;
    react: React.ReactElement;

    tags?: { name: string; value: string }[];
  },
  maxRetries = 3,
  initialDelay = 1000,
) {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      const { data, error } = await resend.emails.send({
        ...emailOptions,
        from: 'iTracksy <support@buddybeep.com>',
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
      react: InactivityEmail({}) as React.ReactElement,
      tags: [
        { name: 'email_type', value: 'inactivity' },
        { name: 'recipient_email', value: sanitizedToEmail(toEmail) },
      ],
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
      react: WelcomeEmail({ name: userFirstName }) as React.ReactElement,
      tags: [
        { name: 'email_type', value: 'welcome' },
        { name: 'recipient_email', value: sanitizedToEmail(toEmail) },
      ],
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
      react: ProductUpdateEmail({}) as React.ReactElement,
      tags: [
        { name: 'email_type', value: 'product_update' },
        { name: 'recipient_email', value: sanitizedToEmail(toEmail) },
      ],
    });
  }
}

export async function sendOTPEmail(userEmail: string, otp: string) {
  try {
    if (userEmail) {
      await sendEmailWithRetry({
        to: userEmail,
        subject: 'Your iTracksy Login OTP',
        react: OTPEmail({ otp }) as React.ReactElement,
        tags: [
          { name: 'email_type', value: 'otp' },
          { name: 'recipient_email', value: sanitizedToEmail(userEmail) },
        ],
      });
    }
  } catch (emailError) {
    console.error('Failed to send OTP email:', emailError);
  }
}

export async function sendFeedbackNotificationEmail(
  name: string,
  email: string,
  feedbackType: string,
  message: string,
) {
  // Send confirmation to the user who submitted feedback
  const toEmail = isDevelopment ? devEmail : email;

  console.log(
    '[sendFeedbackNotificationEmail] Sending feedback confirmation to:',
    toEmail,
  );

  try {
    await sendEmailWithRetry({
      to: toEmail,
      subject: `Thank you for your feedback, ${name}!`,
      react: FeedbackNotificationEmail({ name, email, feedbackType, message }) as React.ReactElement,
      tags: [
        { name: 'email_type', value: 'feedback_confirmation' },
        { name: 'feedback_type', value: feedbackType },
        { name: 'recipient_email', value: sanitizedToEmail(toEmail) },
      ],
    });

    if (isDevelopment) {
      console.log('Feedback confirmation email sent successfully');
    }
  } catch (error) {
    console.error('Failed to send feedback confirmation email:', error);
    throw error;
  }

  const supportEmail = isDevelopment ? devEmail : 'support@buddybeep.com';
  console.log(
    '[sendFeedbackNotificationEmail] Sending feedback notification to:',
    supportEmail,
  );

  try {
    await sendEmailWithRetry({
      to: supportEmail,
      subject: `New Feedback: ${feedbackType} from ${name}`,
      react: FeedbackNotificationEmail({ name, email, feedbackType, message }) as React.ReactElement,
      tags: [
        { name: 'email_type', value: 'feedback_notification' },
        { name: 'feedback_type', value: feedbackType },
      ],
    });

    if (isDevelopment) {
      console.log('Feedback notification email sent successfully');
    }
  } catch (error) {
    console.error('Failed to send feedback notification email:', error);
    throw error;
  }
}

const sanitizedToEmail = (toEmail: string) => {
  return toEmail ? toEmail.replace(/[^\w-]/g, '_') : 'there';
};

export async function sendFeedbackReplyEmail({
  to,
  subject,
  message,
  userName,
  originalMessage,
  feedbackType,
}: {
  to: string;
  subject: string;
  message: string;
  userName: string;
  originalMessage: string;
  feedbackType: string;
}) {
  const toEmail = isDevelopment ? devEmail : to;

  console.log('[sendFeedbackReplyEmail] Sending reply to:', toEmail);

  try {
    await sendEmailWithRetry({
      to: toEmail,
      subject,
      react: FeedbackReplyEmail({
        userName,
        message,
        originalMessage,
        feedbackType,
      }) as React.ReactElement,
      tags: [
        { name: 'email_type', value: 'feedback_reply' },
        { name: 'feedback_type', value: feedbackType },
        { name: 'recipient_email', value: sanitizedToEmail(toEmail) },
      ],
    });

    if (isDevelopment) {
      console.log('Feedback reply email sent successfully');
    }
  } catch (error) {
    console.error('Failed to send feedback reply email:', error);
    throw error;
  }
}
