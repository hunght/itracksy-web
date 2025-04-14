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
} from '@react-email/components';
import * as React from 'react';

interface FeedbackNotificationEmailProps {
  name: string;
  email: string;
  feedbackType: string;
  message: string;
}

export const FeedbackNotificationEmail: React.FC<
  FeedbackNotificationEmailProps
> = ({ name, email, feedbackType, message }) => (
  <Html>
    <Head />
    <Preview>Thank you for your feedback, {name}!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={'https://www.itracksy.com/logo-300.png'}
          width={100}
          height={100}
          alt="iTracksy Logo"
          style={logo}
        />
        <Heading style={h1}>Thank You for Your Feedback</Heading>
        <Text style={text}>Hi {name},</Text>
        <Text style={text}>
          We&apos;ve received your {feedbackType.toLowerCase()} feedback and
          want to thank you for taking the time to share your thoughts with us.
        </Text>
        <Text style={text}>
          Your input is valuable and helps us improve iTracksy for everyone. Our
          team will review your feedback carefully.
        </Text>
        <Section style={summarySection}>
          <Text style={summaryHeader}>Your Feedback Summary:</Text>
          <Text style={summaryText}>
            <strong>Type:</strong> {feedbackType}
          </Text>
          <Text style={summaryText}>
            <strong>Message:</strong> {message}
          </Text>
        </Section>
        <Text style={text}>
          If you have any additional comments or questions, feel free to reply
          to this email or join our community.
        </Text>
        <Button
          onClick={() => window.open(siteConfig.links.discord, '_blank')}
          style={button}
        >
          Join Our Discord
        </Button>
        <Text style={footer}>The iTracksy Team</Text>
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
};

const h1 = {
  color: '#1d1c1d',
  fontSize: '36px',
  fontWeight: '700',
  margin: '30px 0',
  padding: '0',
};

const text = {
  color: '#4a4a4a',
  fontSize: '18px',
  lineHeight: '1.4',
  margin: '0 0 20px',
};

const summarySection = {
  backgroundColor: '#f9f9f9',
  padding: '15px',
  borderRadius: '5px',
  border: '1px solid #e0e0e0',
  margin: '20px 0',
};

const summaryHeader = {
  fontSize: '20px',
  fontWeight: '600',
  marginBottom: '10px',
};

const summaryText = {
  color: '#4a4a4a',
  fontSize: '16px',
  lineHeight: '1.4',
  margin: '0 0 10px',
};

const button = {
  backgroundColor: '#007bff',
  color: '#ffffff',
  padding: '10px 20px',
  textDecoration: 'none',
  borderRadius: '5px',
  display: 'inline-block',
  marginTop: '20px',
};

const footer = {
  color: '#888888',
  fontSize: '14px',
  marginTop: '30px',
};

const logo = {
  margin: '0 auto',
  display: 'block',
};

export default FeedbackNotificationEmail;
