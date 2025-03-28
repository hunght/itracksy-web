import { Html, Head, Body, Container, Text } from '@react-email/components';

interface NewsletterEmailProps {
  name: string;
}

export const NewsletterEmail: React.FC<NewsletterEmailProps> = ({ name }) => {
  return (
    <Html>
      <Head />

      <Body>
        <Container>
          <Text>Hello {name},</Text>
        </Container>
      </Body>
    </Html>
  );
};
