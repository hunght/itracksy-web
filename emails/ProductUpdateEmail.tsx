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

export const ProductUpdateEmail: React.FC = () => (
  <Html>
    <Head />
    <Preview>New updates for iTracksy!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={'https://www.itracksy.com/logo-300.png'}
          width={100}
          height={100}
          alt="iTracksy Logo"
          style={logo}
        />
        <Heading style={h1}>New Updates for iTracksy</Heading>
        <Text style={p}>
          We&apos;re excited to announce some new updates to iTracksy! Our team
          has been working hard to bring you the best experience possible.
        </Text>
        <Button style={btn} href="https://www.itracksy.com">
          Explore New Features Now
        </Button>
        <Text style={p}>
          If you have any questions or need help with the new features, feel
          free to reply to this email or contact our support team at{' '}
          <a href="mailto:support@itracksy.com">support@itracksy.com</a>.
        </Text>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: '#fff',
  fontFamily: 'Arial, sans-serif',
  fontSize: '16px',
  lineHeight: '1.5',
  padding: '20px',
};

const container = {
  backgroundColor: '#fff',
  borderRadius: '3px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  maxWidth: '600px',
  margin: '40px auto',
  padding: '20px',
};

const h1 = {
  fontSize: '24px',
  marginBottom: '10px',
};

const p = {
  marginBottom: '20px',
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
  margin: '0 auto',
  display: 'block',
};

export default ProductUpdateEmail;
