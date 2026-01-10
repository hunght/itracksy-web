import { EMAIL_TEMPLATES, TemplateType } from '@/config/email_campaigns';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY);

// Helper to validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { testEmail, emailSubject, emailTemplate } = body;

    if (!testEmail || !emailSubject || !emailTemplate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    // Validate email format
    if (!isValidEmail(testEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format. Please use format: email@example.com' },
        { status: 400 },
      );
    }

    // Attempt to send the test email
    const emailElement = EMAIL_TEMPLATES[emailTemplate as TemplateType]({
      name: 'Test User',
    });
    const { data, error } = await resend.emails.send({
      from: 'iTracksy <noreply@itracksy.com>',
      to: [testEmail.trim()], // Ensure email is trimmed and in an array
      subject: `[TEST] ${emailSubject}`,
      react: emailElement as React.ReactElement,
      tags: [
        { name: 'email_type', value: 'test_campaign' },
        { name: 'template', value: emailTemplate },
      ],
    });

    if (error) {
      console.error('Error sending test email:', error);
      return NextResponse.json(
        { error: `Failed to send test email: ${error.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      recipient: testEmail,
    });
  } catch (error) {
    console.error('Error in send-test-email endpoint:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? `Internal server error: ${error.message}`
            : 'Internal server error',
      },
      { status: 500 },
    );
  }
}
