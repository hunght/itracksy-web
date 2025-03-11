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
  recipientName?: string;
}

const BetaInviteEmail: React.FC<BetaInviteEmailProps> = ({
  recipientName = 'there',
}) => {
  const downloadUrl = 'https://www.itracksy.com/download';
  const feedbackUrl = 'https://www.itracksy.com/feedback';
  const discordUrl = siteConfig.links.discord;

  return (
    <Html>
      <Head />
      <Preview>
        iTracksy has been released and is available to download now!
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
          <Heading style={h1}>iTracksy has been released!</Heading>
          <Text style={text}>Hello {recipientName},</Text>
          <Text style={text}>
            First of all, we would like to thank you for patently waiting for
            iTracksy. We are delighted to announce that the first version of
            iTracksy, your time management tool and productivity booster, has
            been released 🥳
          </Text>

          <Button style={btn} href={downloadUrl}>
            Download iTracksy
          </Button>

          <Text style={text}>
            On the other hand, we really apologize for the delay because of some
            critical bugs, but we did not give up and finally can deliver
            iTracksy to you. So, to make this application better for everyone,
            your feedbacks and bug reports are highly appreciated or you can
            join the development with us on Discord 🤗
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
            Once again, thank you very much for believing, understanding and
            waiting for us. We hope iTracksy can bring to you all the best that
            you look for in a time management application 💗
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

export default BetaInviteEmail;
