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
  Section,
  Hr,
} from '@react-email/components';
import * as React from 'react';

interface BetaInviteEmailProps {
  recipientName?: string;
  inviteCode?: string;
  expiryDays?: number;
}

export const BetaInviteEmail: React.FC<BetaInviteEmailProps> = ({
  recipientName = 'there',
  inviteCode = 'BETATESTER2024',
  expiryDays = 7,
}) => {
  const signupUrl = `https://www.itracksy.com/signup?code=${inviteCode}`;

  return (
    <Html>
      <Head />
      <Preview>You&apos;re invited to try iTracksy Beta!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src={'https://www.itracksy.com/logo-300.png'}
            width={100}
            height={100}
            alt="iTracksy Logo"
            style={logo}
          />
          <Heading style={h1}>Exclusive Beta Access</Heading>
          <Text style={text}>Hello {recipientName},</Text>
          <Text style={text}>
            You&apos;ve been selected for exclusive early access to iTracksy -
            your productivity tracking companion!
          </Text>

          <Section style={betaBox}>
            <Heading as="h2" style={h2}>
              Your Invitation Details
            </Heading>
            <Text style={codeText}>
              <strong>Your invite code:</strong> {inviteCode}
            </Text>
            <Text style={noteText}>This code expires in {expiryDays} days</Text>
          </Section>

          <Text style={text}>As a beta tester, you&apos;ll get:</Text>

          <ul style={list}>
            <li style={listItem}>Early access to all premium features</li>
            <li style={listItem}>
              Direct feedback channel to our development team
            </li>
            <li style={listItem}>
              Influence on future features and improvements
            </li>
            <li style={listItem}>Extended free trial period when we launch</li>
          </ul>

          <Button style={btn} href={signupUrl}>
            Accept Invitation
          </Button>

          <Hr style={divider} />

          <Text style={smallText}>
            This invitation is exclusive to you and cannot be shared. The invite
            code is valid for {expiryDays} days.
          </Text>

          <Text style={text}>
            We&apos;re excited to have you on board during this crucial
            development phase. Your feedback will be invaluable in shaping the
            future of iTracksy.
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
};

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
  margin: '0 auto 20px',
  display: 'block',
};

const h1 = {
  color: '#1d1c1d',
  fontSize: '36px',
  fontWeight: '700',
  margin: '30px 0 15px',
  padding: '0',
  textAlign: 'center' as const,
};

const h2 = {
  color: '#1d1c1d',
  fontSize: '24px',
  fontWeight: '600',
  margin: '15px 0',
  padding: '0',
};

const text = {
  color: '#4a4a4a',
  fontSize: '18px',
  lineHeight: '1.4',
  margin: '0 0 20px',
};

const smallText = {
  color: '#6b6b6b',
  fontSize: '14px',
  lineHeight: '1.4',
  margin: '10px 0 20px',
  fontStyle: 'italic',
};

const btn = {
  backgroundColor: '#9333ea',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '18px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '16px 32px',
  margin: '30px auto',
  width: '250px',
  boxShadow: '0 4px 6px rgba(147, 51, 234, 0.3)',
  transition: 'all 0.3s ease',
};

const betaBox = {
  backgroundColor: '#f9f5ff',
  borderRadius: '8px',
  padding: '20px',
  margin: '25px 0',
  border: '1px solid #e9d5ff',
};

const codeText = {
  fontSize: '20px',
  color: '#4a4a4a',
  margin: '10px 0',
  padding: '10px',
  backgroundColor: '#ffffff',
  borderRadius: '4px',
  border: '1px dashed #9333ea',
  textAlign: 'center' as const,
};

const noteText = {
  fontSize: '14px',
  color: '#6b6b6b',
  margin: '5px 0 0',
  textAlign: 'center' as const,
};

const list = {
  margin: '0 0 20px',
  padding: '0 0 0 20px',
};

const listItem = {
  color: '#4a4a4a',
  fontSize: '18px',
  lineHeight: '1.4',
  margin: '10px 0',
};

const divider = {
  borderTop: '1px solid #e6e6e6',
  margin: '30px 0 20px',
};

export default BetaInviteEmail;
