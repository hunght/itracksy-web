import { siteConfig } from '@/config/site';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Img,
  Button,
  Section,
  Hr,
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
  feedbackType,
}) => (
  <Html>
    <Head />
    <Preview>Response to your {feedbackType} feedback - iTracksy</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={'https://www.itracksy.com/logo-300.png'}
          width={100}
          height={100}
          alt="iTracksy Logo"
          style={logo}
        />
        <Heading style={h1}>Response to Your Feedback</Heading>

        {/* Reply Message */}
        <Section style={messageSection}>
          <Text style={messageText}>{message}</Text>
        </Section>

        <Hr style={divider} />

        {/* Original Message Reference */}
        <Section style={originalSection}>
          <Text style={originalHeader}>Your Original Feedback:</Text>
          <Text style={originalType}>
            <strong>Type:</strong> {feedbackType}
          </Text>
          <Text style={originalText}>{originalMessage}</Text>
        </Section>

        <Hr style={divider} />

        <Text style={text}>
          Have more questions or feedback? Feel free to reply to this email or
          join our Discord community.
        </Text>

        <Button href={siteConfig.links.discord} style={button}>
          Join Our Discord
        </Button>

        <Text style={footer}>
          Best regards,
          <br />
          The iTracksy Team
        </Text>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '600px',
};

const logo = {
  margin: '0 auto',
  display: 'block',
};

const h1 = {
  color: '#1d1c1d',
  fontSize: '28px',
  fontWeight: '700',
  margin: '30px 0 20px',
  padding: '0',
  textAlign: 'center' as const,
};

const text = {
  color: '#4a4a4a',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 20px',
};

const messageSection = {
  backgroundColor: '#f8fafc',
  padding: '20px',
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
  margin: '20px 0',
};

const messageText = {
  color: '#1e293b',
  fontSize: '16px',
  lineHeight: '1.7',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
};

const originalSection = {
  backgroundColor: '#fafafa',
  padding: '15px',
  borderRadius: '6px',
  borderLeft: '3px solid #94a3b8',
  margin: '20px 0',
};

const originalHeader = {
  color: '#64748b',
  fontSize: '12px',
  fontWeight: '600',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  marginBottom: '10px',
};

const originalType = {
  color: '#64748b',
  fontSize: '14px',
  margin: '0 0 8px',
};

const originalText = {
  color: '#64748b',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '0',
  fontStyle: 'italic' as const,
};

const divider = {
  borderColor: '#e2e8f0',
  margin: '30px 0',
};

const button = {
  backgroundColor: '#3b82f6',
  color: '#ffffff',
  padding: '12px 24px',
  textDecoration: 'none',
  borderRadius: '6px',
  display: 'inline-block',
  marginTop: '10px',
  fontWeight: '500',
};

const footer = {
  color: '#94a3b8',
  fontSize: '14px',
  marginTop: '40px',
  lineHeight: '1.6',
};

export default FeedbackReplyEmail;
