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

interface RoadmapEmailProps {
  recipientName?: string;
}

export const RoadmapEmail: React.FC<RoadmapEmailProps> = ({
  recipientName = 'there',
}) => {
  const roadmapUrl = 'https://www.itracksy.com/roadmap';
  const feedbackFormUrl = 'https://www.itracksy.com/roadmap-feedback';
  const discordUrl = siteConfig.links.discord;

  return (
    <Html>
      <Head />
      <Preview>
        Check out iTracksy&apos;s development plan/roadmap with us!
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
          <Heading style={h1}>iTracksy Development Roadmap</Heading>
          <Text style={text}>Hello {recipientName},</Text>
          <Text style={text}>
            It is the iTracksy team here. We hope that you have had great time
            using iTracksy and it does not cause any troubles. However, if there
            is something irritating & needing improvements, please feel free to
            tell us either through our feedback form or in our Discord server 👋
          </Text>

          <Text style={text}>
            So, the main content of this message is to communicate with you
            about iTracksy&apos;s development roadmap. You can see it right
            below 👇
          </Text>

          <Button style={btn} href={roadmapUrl}>
            View 2025 Roadmap
          </Button>

          <Text style={text}>
            Still, a plan is still a plan and we would love to see your opinions
            on it. Do you want to change anything, request any features, add or
            remove something? We are all ears!
          </Text>

          <Section style={buttonContainer}>
            <Button style={secondaryBtn} href={feedbackFormUrl}>
              Submit Roadmap Feedback
            </Button>
            <Button style={secondaryBtn} href={discordUrl}>
              Join Discord
            </Button>
          </Section>

          <Hr style={divider} />

          <Text style={text}>
            Thank you and we look forward to hearing from you.
          </Text>

          <Text style={text}>
            All the best,
            <br />
            iTracksy Team
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

export default RoadmapEmail;
