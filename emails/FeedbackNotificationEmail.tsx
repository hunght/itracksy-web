import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Img,
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
    <Preview>New Feedback Received from {name}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={'https://www.itracksy.com/logo-300.png'}
          width={100}
          height={100}
          alt="iTracksy Logo"
          style={logo}
        />
        <Heading style={h1}>New Feedback Received</Heading>
        <Text style={text}>A new feedback has been submitted by a user.</Text>
        <Text style={text}>
          <strong>Name:</strong> {name}
        </Text>
        <Text style={text}>
          <strong>Email:</strong> {email}
        </Text>
        <Text style={text}>
          <strong>Feedback Type:</strong> {feedbackType}
        </Text>
        <Text style={text}>
          <strong>Message:</strong>
        </Text>
        <Text style={messageStyle}>{message}</Text>
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

const messageStyle = {
  ...text,
  backgroundColor: '#f5f5f5',
  padding: '15px',
  borderRadius: '5px',
  border: '1px solid #e0e0e0',
};

const logo = {
  margin: '0 auto',
  display: 'block',
};

export default FeedbackNotificationEmail;
