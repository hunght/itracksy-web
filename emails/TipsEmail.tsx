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

interface TipsEmailProps {
  name: string;
}

export const TipsEmail: React.FC<TipsEmailProps> = ({ name = 'there' }) => {
  const feedbackFormUrl = 'https://www.itracksy.com/feedback';
  const discordUrl = siteConfig.links.discord;
  const downloadAppUrl = 'https://www.itracksy.com/download';

  return (
    <Html>
      <Head />
      <Preview>
        How to maximize iTracksy&apos;s potential to turn up your productivity?
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
          <Heading style={h1}>Maximize Your Productivity with iTracksy</Heading>
          <Text style={text}>Hi {name},</Text>
          <Text style={text}>
            It has been more than a week since iTracksy&apos;s release and we
            appreciate your support. We really wish that iTracksy has been able
            to help you in work, learning and daily activities. Still, here we
            are to show you around and give you some tips to get the best out of
            the tool 💪
          </Text>

          <div style={tipContainer}>
            <Text style={tipTitle}>Tip #1:</Text>
            <Text style={tipText}>
              Always remember to track the time in the start (we are releasing
              an automated time tracking soon in the future 😉)
            </Text>
          </div>

          <div style={tipContainer}>
            <Text style={tipTitle}>Tip #2:</Text>
            <Text style={tipText}>
              Regularly check the report tab to review your performance in
              different periods
            </Text>
          </div>

          <div style={tipContainer}>
            <Text style={tipTitle}>Tip #3:</Text>
            <Text style={tipText}>
              Arrange your projects/tasks based on preferences to keep track of
              everything
            </Text>
          </div>

          <div style={tipContainer}>
            <Text style={tipTitle}>Tip #4:</Text>
            <Text style={tipText}>
              Apply time management strategies like Pomodoro, timeboxing,
              Eisenhower matrix, etc. (presets of them will be added in the
              future)
            </Text>
          </div>

          <div style={tipContainer}>
            <Text style={tipTitle}>Tip #5:</Text>
            <Text style={tipText}>
              Adjust iTracksy&apos;s notifications to keep your focus at 100%
              and remove distractions (the system will be updated constantly to
              be smarter and have more settings)
            </Text>
          </div>

          <Text style={text}>
            Well, that pretty much wraps up this email. To ensure your
            experience, the team will work hard to make iTracksy better and
            better. And yes, we are really happy to have your feedbacks or
            participation in the development 💌
          </Text>

          <Button style={btn} href={downloadAppUrl}>
            Download iTracksy App
          </Button>

          <Section style={buttonContainer}>
            <Button style={secondaryBtn} href={feedbackFormUrl}>
              Submit Feedback
            </Button>
            <Button style={secondaryBtn} href={discordUrl}>
              Join Discord
            </Button>
          </Section>

          <Hr style={divider} />

          <Text style={text}>
            Thank you, {name}, for your support. See you again soon.
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

const tipContainer = {
  margin: '0 0 15px',
  padding: '15px',
  backgroundColor: '#f9f5ff',
  borderRadius: '8px',
  borderLeft: '4px solid #9333ea',
};

const tipTitle = {
  color: '#9333ea',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 5px',
};

const tipText = {
  color: '#4a4a4a',
  fontSize: '16px',
  lineHeight: '1.4',
  margin: '0',
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

export default TipsEmail;
