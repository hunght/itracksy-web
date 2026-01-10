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

// Simple markdown to HTML converter
function markdownToHtml(markdown: string): string {
  let html = markdown
    // Escape HTML
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Headers
    .replace(
      /^### (.*$)/gm,
      '<h3 style="font-size: 18px; font-weight: 600; margin-top: 16px; margin-bottom: 8px;">$1</h3>',
    )
    .replace(
      /^## (.*$)/gm,
      '<h2 style="font-size: 20px; font-weight: 600; margin-top: 16px; margin-bottom: 8px;">$1</h2>',
    )
    .replace(
      /^# (.*$)/gm,
      '<h1 style="font-size: 24px; font-weight: 700; margin-top: 16px; margin-bottom: 8px;">$1</h1>',
    )
    // Bold and italic
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Links
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" style="color: #f59e0b; text-decoration: underline;">$1</a>',
    )
    // Unordered lists
    .replace(/^\s*[-*]\s+(.*$)/gm, '<li style="margin-left: 16px;">$1</li>')
    // Line breaks (double newline = paragraph)
    .replace(/\n\n/g, '</p><p style="margin: 8px 0;">')
    // Single line breaks
    .replace(/\n/g, '<br />');

  // Wrap in paragraph tags
  html = '<p style="margin: 8px 0;">' + html + '</p>';

  // Clean up empty paragraphs
  html = html.replace(/<p style="margin: 8px 0;"><\/p>/g, '');

  // Wrap consecutive list items in ul
  html = html.replace(
    /(<li[^>]*>.*?<\/li>)+/g,
    '<ul style="list-style-type: disc; margin: 8px 0; padding-left: 20px;">$&</ul>',
  );

  return html;
}

// Generate HTML email wrapper
function generateEmailHtml(content: string, recipientName: string): string {
  // Replace {{name}} with recipient name
  const personalizedContent = content.replace(/\{\{name\}\}/g, recipientName);
  const htmlContent = markdownToHtml(personalizedContent);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  ${htmlContent}
  <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
  <p style="font-size: 12px; color: #666;">
    Sent by <a href="https://itracksy.com" style="color: #f59e0b;">iTracksy</a>
  </p>
</body>
</html>`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { testEmail, emailSubject, emailTemplate, emailContent } = body;

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

    let emailData;

    // Handle markdown template type
    if (emailTemplate === 'markdown') {
      if (!emailContent) {
        return NextResponse.json(
          { error: 'Email content is required for markdown template' },
          { status: 400 },
        );
      }

      const htmlEmail = generateEmailHtml(emailContent, 'Test User');

      emailData = await resend.emails.send({
        from: 'iTracksy <noreply@itracksy.com>',
        to: [testEmail.trim()],
        subject: `[TEST] ${emailSubject}`,
        html: htmlEmail,
        tags: [
          { name: 'email_type', value: 'test_campaign' },
          { name: 'template', value: 'markdown' },
        ],
      });
    } else {
      // Use predefined React email template
      const emailElement = EMAIL_TEMPLATES[emailTemplate as TemplateType]({
        name: 'Test User',
      });

      emailData = await resend.emails.send({
        from: 'iTracksy <noreply@itracksy.com>',
        to: [testEmail.trim()],
        subject: `[TEST] ${emailSubject}`,
        react: emailElement as React.ReactElement,
        tags: [
          { name: 'email_type', value: 'test_campaign' },
          { name: 'template', value: emailTemplate },
        ],
      });
    }

    const { data, error } = emailData;

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
