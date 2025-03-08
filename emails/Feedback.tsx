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

export const FeedbackEmail: React.FC = () => (
  <Html>
    <Head />
    <Preview>iTracksy Needs Your Feedback To Serve You Better</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={'https://www.itracksy.com/logo-300.png'}
          width={100}
          height={100}
          alt="iTracksy Logo"
          style={logo}
        />
        <Heading style={h1}>Hi there, awesome iTracksy users!</Heading>
        <Text style={text}>
          We hope iTracksy is serving you well. But, we don&apos;t want to stop
          there as our aim is to make the product better and greater for you.
          So, we would love to hear from you guys!
        </Text>
        <Text style={text}>
          Your feedbacks will be like the secret sauce that makes our product
          even more delicious. 🍔 Now let&apos;s get into it and help us level
          up 👇
        </Text>
        <Button style={btn} href="https://www.itracksy.com/feedback">
          Help us improve here!
        </Button>
        <Text style={text}>
          In return, we will give you exclusive updates and public information
          into what we are building and developing. Jump into the development
          with us!
        </Text>
        <Text style={text}>
          Remember, your words have the power to shape the future of iTracksy.
          So, let&apos;s make this feedback dance epic! 💃
        </Text>
        <Text style={text}>
          Thanks a gazillion (that&apos;s like a bajillion, but with more
          zeroes) for being part of our cosmic crew. 🚀
        </Text>
        <Text style={text}>
          Regards,
          <br />
          iTracksy
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
  margin: '0 auto',
  display: 'block',
};

export default FeedbackEmail;
