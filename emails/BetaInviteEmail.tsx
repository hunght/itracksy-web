import { siteConfig } from '@/config/site';
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
  name?: string;
}

export const BetaInviteBuddybeepEmail: React.FC<BetaInviteEmailProps> = ({
  name = 'there',
}) => {
  const downloadUrl = 'https://www.itracksy.com/download';
  const feedbackUrl = 'https://www.itracksy.com/feedback';
  const discordUrl = siteConfig.links.discord;

  return (
    <Html>
      <Head />
      <Preview>
        From Buddybeep to iTracksy: Your invite to our new advanced productivity
        app!
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src={'https://www.itracksy.com/icon-300.png'}
            width={100}
            height={100}
            alt="iTracksy Logo"
            style={logo}
          />
          <Heading style={h1}>Welcome to iTracksy!</Heading>
          <Text style={text}>Hello {name},</Text>
          <Text style={text}>
            {`As a valued Buddybeep user, we're excited to invite you to iTracksy
            - our new and improved time management and productivity platform
            that builds on everything you loved about Buddybeep while adding
            powerful new features!`}
          </Text>

          <Text style={text}>
            {`iTracksy represents the next evolution of our productivity tools,
            designed with feedback from users like you. We've enhanced the core
            time-tracking capabilities while adding robust project management,
            improved analytics, and a more intuitive interface.`}
          </Text>

          <Button style={btn} href={downloadUrl}>
            Download iTracksy Now
          </Button>

          <Text style={text}>
            <strong>{`What's new in iTracksy:`}</strong>
          </Text>
          <ul style={listStyle}>
            <li style={listItem}>
              Enhanced time tracking with automated suggestions
            </li>
            <li style={listItem}>
              Advanced project organization and task management
            </li>
            <li style={listItem}>
              Improved reporting and productivity insights
            </li>
            <li style={listItem}>Seamless cross-device synchronization</li>
            <li style={listItem}>Intuitive, modern interface</li>
          </ul>

          <Text style={text}>
            {`As we focus our development efforts on iTracksy, we'll be gradually
            phasing out support for Buddybeep. We've made the transition process
            simple, and your feedback during this beta period is invaluable to
            us.`}
          </Text>

          <Section style={buttonContainer}>
            <Button style={secondaryBtn} href={feedbackUrl}>
              Submit Feedback
            </Button>
            <Button style={secondaryBtn} href={discordUrl}>
              Join Discord
            </Button>
          </Section>

          <Hr style={divider} />

          <Text style={text}>
            {`Thank you for being part of our journey from Buddybeep to iTracksy.
            We've built this new platform with users like you in mind, and we
            can't wait to hear what you think!`}
          </Text>

          <Text style={text}>
            All the best,
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
  display: 'block',
  padding: '16px 32px',
  margin: '30px auto',
  width: '250px',
  boxShadow: '0 4px 6px rgba(147, 51, 234, 0.3)',
  transition: 'all 0.3s ease',
};

const secondaryBtn = {
  backgroundColor: '#f9f5ff',
  borderRadius: '8px',
  color: '#9333ea',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  padding: '12px 24px',
  margin: '0 10px',
  border: '1px solid #e9d5ff',
  boxShadow: '0 2px 4px rgba(147, 51, 234, 0.2)',
  transition: 'all 0.3s ease',
};

const buttonContainer = {
  display: 'flex',
  justifyContent: 'center',
  margin: '20px 0',
};

const divider = {
  borderTop: '1px solid #e9d5ff',
  margin: '30px 0',
};

const listStyle = {
  paddingLeft: '20px',
  marginBottom: '20px',
};

const listItem = {
  marginBottom: '10px',
};

export default BetaInviteBuddybeepEmail;
