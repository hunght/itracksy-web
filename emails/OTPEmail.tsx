import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface OTPEmailProps {
  otp: string;
}

export const OTPEmail: React.FC<OTPEmailProps> = ({ otp }) => (
  <Html>
    <Head />
    <Preview>Your iTracksy Login OTP</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Your iTracksy Login OTP</Heading>
        <Text style={text}>
          Here&apos;s your one-time password (OTP) to log in to iTracksy:
        </Text>
        <Button style={btn}>{otp}</Button>
        <Text style={text}>
          This OTP will expire in 10 minutes. If you didn&apos;t request this,
          please ignore this email.
        </Text>
        <Text style={text}>
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

const btn = {
  backgroundColor: '#9333ea',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '24px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '16px 32px',
  margin: '30px auto',
  boxShadow: '0 4px 6px rgba(147, 51, 234, 0.3)',
};

export default OTPEmail;
