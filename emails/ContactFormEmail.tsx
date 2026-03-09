import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface ContactFormEmailProps {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactFormEmail({
  name,
  email,
  subject,
  message,
}: ContactFormEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New contact form message from {name}: {subject}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Contact Form Message</Heading>
          <Text style={text}>You've received a new message from the Allante String Quartet website.</Text>

          <Hr style={hr} />

          <Section>
            <Heading as="h2" style={h2}>
              Contact Information
            </Heading>
            <Text style={text}>
              <strong>Name:</strong> {name}
            </Text>
            <Text style={text}>
              <strong>Email:</strong>{' '}
              <a href={`mailto:${email}`} style={link}>
                {email}
              </a>
            </Text>
            <Text style={text}>
              <strong>Subject:</strong> {subject}
            </Text>
          </Section>

          <Hr style={hr} />

          <Section>
            <Heading as="h2" style={h2}>
              Message
            </Heading>
            <Text style={messageText}>{message}</Text>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            This email was sent from the Allante String Quartet website contact form.
            <br />
            Reply directly to this email to respond to {name}.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const h1 = {
  color: '#002E5C',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0 40px',
};

const h2 = {
  color: '#002E5C',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '20px 40px 10px',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '8px 40px',
};

const messageText = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 40px',
  padding: '20px',
  backgroundColor: '#f6f9fc',
  borderRadius: '4px',
  whiteSpace: 'pre-wrap' as const,
};

const link = {
  color: '#BF759E',
  textDecoration: 'underline',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 40px',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '20px 40px',
};
