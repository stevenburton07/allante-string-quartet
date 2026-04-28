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
import { formatTime12h } from '@/lib/format-time';

interface HireQuoteRequestProps {
  name: string;
  email: string;
  eventType: string;
  address: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  performerType: string;
  additionalDetails?: string;
}

export default function HireQuoteRequest({
  name,
  email,
  eventType,
  address,
  eventDate,
  startTime,
  endTime,
  performerType,
  additionalDetails,
}: HireQuoteRequestProps) {
  const eventTypeLabels: Record<string, string> = {
    wedding: 'Wedding',
    corporate: 'Corporate Event',
    party: 'Party',
    other: 'Other',
  };

  const performerTypeLabels: Record<string, string> = {
    'solo-violin': 'Solo Violin',
    'solo-viola': 'Solo Viola',
    'solo-cello': 'Solo Cello',
    quartet: 'Quartet',
  };

  const formattedEventDate = new Date(eventDate + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Html>
      <Head />
      <Preview>New hire quote request from {name}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Hire Quote Request</Heading>
          <Text style={text}>You've received a new quote request for the Allante String Quartet.</Text>

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
          </Section>

          <Hr style={hr} />

          <Section>
            <Heading as="h2" style={h2}>
              Event Details
            </Heading>
            <Text style={text}>
              <strong>Event Type:</strong> {eventTypeLabels[eventType] || eventType}
            </Text>
            <Text style={text}>
              <strong>Date:</strong> {formattedEventDate}
            </Text>
            <Text style={text}>
              <strong>Time:</strong> {formatTime12h(startTime)} - {formatTime12h(endTime)}
            </Text>
            <Text style={text}>
              <strong>Location:</strong> {address}
            </Text>
            <Text style={text}>
              <strong>Performer Type:</strong> {performerTypeLabels[performerType] || performerType}
            </Text>
          </Section>

          {additionalDetails && (
            <>
              <Hr style={hr} />
              <Section>
                <Heading as="h2" style={h2}>
                  Additional Details
                </Heading>
                <Text style={text}>{additionalDetails}</Text>
              </Section>
            </>
          )}

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

const link = {
  color: '#D14377',
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
