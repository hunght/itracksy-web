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

interface LaunchEmailProps {
  name: string;
  launchPlatform?: 'Product Hunt' | 'Uneed' | string;
  launchUrl?: string;
}

export const LaunchEmail: React.FC<LaunchEmailProps> = ({
  name = 'there',
  launchPlatform = 'Product Hunt',
  launchUrl = 'https://www.producthunt.com/posts/itracksy',
}) => {
  const discordUrl = siteConfig.links.discord;

  return (
    <Html>
      <Head />
      <Preview>Lend us a hand in spreading iTracksy further!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src={'https://www.itracksy.com/icon-300.png'}
            width={100}
            height={100}
            alt="iTracksy Logo"
            style={logo}
          />
          <Heading style={h1}>
            We&apos;re Launching on {launchPlatform}!
          </Heading>
          <Text style={text}>Hi {name},</Text>
          <Text style={text}>
            We hope that you have had great time using iTracksy. Today, we are
            officially launching on {launchPlatform} and your upvotes will fuel
            us a lot in the development process. Your support will also help us
            spread iTracksy to more people, thus making it better everyday.
          </Text>

          <Text style={highlightText}>
            To make the vote, check out the link below, sign-in (if needed) and
            press Upvote:
          </Text>

          <Button style={btn} href={launchUrl}>
            Support Us on {launchPlatform}
          </Button>

          <Text style={text}>
            Thank you very much for your support. Let&apos;s take iTracksy to
            the #1 together.
          </Text>

          <Hr style={divider} />

          <Text style={text}>
            All the best,
            <br />
            iTracksy Team
          </Text>

          <Section style={socialSection}>
            <Text style={socialText}>Join our community:</Text>
            <Button style={socialBtn} href={discordUrl}>
              Discord
            </Button>
          </Section>
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

const highlightText = {
  color: '#9333ea',
  fontSize: '20px',
  fontWeight: 'bold' as const,
  margin: '30px 0 15px',
  textAlign: 'center' as const,
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
  width: '300px',
  boxShadow: '0 4px 6px rgba(147, 51, 234, 0.3)',
  transition: 'all 0.3s ease',
};

const divider = {
  borderTop: '1px solid #e9d5ff',
  margin: '30px 0',
};

const socialSection = {
  marginTop: '30px',
  textAlign: 'center' as const,
};

const socialText = {
  color: '#6b7280',
  fontSize: '16px',
  margin: '0 0 10px',
};

const socialBtn = {
  backgroundColor: '#f9f5ff',
  borderRadius: '8px',
  color: '#9333ea',
  fontSize: '14px',
  fontWeight: 'bold',
  textDecoration: 'none',
  padding: '8px 16px',
  margin: '0 5px',
  border: '1px solid #e9d5ff',
  display: 'inline-block',
};

export default LaunchEmail;
