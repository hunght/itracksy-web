import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Img,
} from '@react-email/components';
import * as React from 'react';

interface WelcomeEmailProps {
  userFirstName: string;
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({
  userFirstName,
}) => (
  <Html>
    <Head />
    <Preview>Welcome to iTracksy!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={'https://www.itracksy.com/logo-300.png'}
          width={100}
          height={100}
          alt="iTracksy Logo"
          style={logo}
        />
        <Heading style={h1}>Welcome to iTracksy!</Heading>
        <Text style={text}>Hello {userFirstName},</Text>
        <Text style={text}>
          {`We're excited to have you on board. iTracksy is here to help you
          connect and collaborate.`}
        </Text>
        <Button style={btn} href="https://www.itracksy.com">
          Start Your Journey Now
        </Button>
        <Text style={text}>
          If you have any questions, feel free to reach out to our support team.
        </Text>
        <Text style={text}>
          Don&apos;t forget to download our extension to get the most out of
          iTracksy!
        </Text>
        <Button style={secondaryBtn} href="https://www.itracksy.com/install">
          Download Extension
        </Button>
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
  fontSize: '18px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '16px 32px',
  margin: '30px auto',
  boxShadow: '0 4px 6px rgba(147, 51, 234, 0.3)',
  transition: 'all 0.3s ease',
};

const logo = {
  margin: '0 auto 20px',
  display: 'block',
};

const secondaryBtn = {
  ...btn,
  backgroundColor: '#ffffff',
  color: '#9333ea',
  border: '2px solid #9333ea',
  marginTop: '0',
};

export default WelcomeEmail;
