import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Text,
  Link,
} from '@react-email/components';
import * as React from 'react';

interface FeedbackReplyEmailProps {
  userName: string;
  message: string;
  originalMessage: string;
  feedbackType: string;
}

export const FeedbackReplyEmail: React.FC<FeedbackReplyEmailProps> = ({
  userName,
  message,
  originalMessage,
}) => (
  <Html>
    <Head />
    <Preview>Re: Your message to iTracksy Support</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={text}>{message}</Text>

        {originalMessage && (
          <>
            <Text style={quotedHeader}>On your previous message:</Text>
            <Text style={quotedText}>{originalMessage}</Text>
          </>
        )}

        <Text style={signature}>
          --
          <br />
          iTracksy Support
          <br />
          <Link href="https://www.itracksy.com" style={link}>
            www.itracksy.com
          </Link>
        </Text>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px',
  maxWidth: '600px',
};

const text = {
  color: '#333333',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0 0 16px',
  whiteSpace: 'pre-wrap' as const,
};

const quotedHeader = {
  color: '#666666',
  fontSize: '12px',
  margin: '24px 0 8px',
};

const quotedText = {
  color: '#666666',
  fontSize: '13px',
  lineHeight: '1.5',
  margin: '0',
  paddingLeft: '12px',
  borderLeft: '2px solid #cccccc',
  fontStyle: 'italic' as const,
  whiteSpace: 'pre-wrap' as const,
};

const signature = {
  color: '#666666',
  fontSize: '13px',
  lineHeight: '1.5',
  marginTop: '32px',
};

const link = {
  color: '#0066cc',
  textDecoration: 'none',
};

export default FeedbackReplyEmail;
