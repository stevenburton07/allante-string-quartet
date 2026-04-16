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

interface NewsletterWelcomeProps {
  name: string;
}

export default function NewsletterWelcome({ name }: NewsletterWelcomeProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to the Allante String Quartet newsletter!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to Our Community!</Heading>

          <Text style={text}>Dear {name},</Text>

          <Text style={text}>
            Thank you for subscribing to the Allante String Quartet newsletter! We're thrilled to
            have you join our community of chamber music enthusiasts.
          </Text>

          <Hr style={hr} />

          <Section>
            <Heading as="h2" style={h2}>
              What to Expect
            </Heading>

            <div style={infoBox}>
              <Text style={infoText}>
                <strong>🎵 Concert announcements</strong>
                <br />
                Be the first to know about upcoming performances and special events
              </Text>

              <Text style={infoText}>
                <strong>🌅 Sunset Series updates</strong>
                <br />
                Get early access to our exclusive outdoor chamber music experiences
              </Text>

              <Text style={infoText}>
                <strong>🎻 Behind-the-scenes content</strong>
                <br />
                Enjoy exclusive stories, rehearsal insights, and musician spotlights
              </Text>

              <Text style={infoText}>
                <strong>📰 News & announcements</strong>
                <br />
                Stay informed about special collaborations, recordings, and more
              </Text>
            </div>
          </Section>

          <Hr style={hr} />

          <Section>
            <Heading as="h2" style={h2}>
              Stay Connected
            </Heading>

            <Text style={text}>
              Follow us on social media for more frequent updates, performance clips, and community
              highlights:
            </Text>

            <div style={socialBox}>
              <Text style={socialText}>
                <strong>YouTube:</strong> @allantestringquartet
                <br />
                <strong>Instagram:</strong> @allantestringquartet
                <br />
                <strong>Facebook:</strong> /allantestringquartet
              </Text>
            </div>
          </Section>

          <Hr style={hr} />

          <Text style={text}>
            We're grateful to have you as part of our audience. Your support helps us continue
            bringing beautiful chamber music to Utah County and beyond.
          </Text>

          <Text style={signature}>
            With gratitude,
            <br />
            The Allante String Quartet
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            Allante String Quartet
            <br />
            Email: allantestringquartet@gmail.com
            <br />
            <br />
            If you received this email by mistake or wish to unsubscribe, please contact us at
            allantestringquartet@gmail.com.
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
  textAlign: 'center' as const,
};

const h2 = {
  color: '#002E5C',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '30px 40px 15px',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '12px 40px',
};

const infoBox = {
  backgroundColor: '#f6f9fc',
  border: '2px solid #BF759E',
  borderRadius: '8px',
  margin: '20px 40px',
  padding: '20px',
};

const infoText = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '15px 0',
};

const socialBox = {
  backgroundColor: '#93C4F5',
  borderRadius: '8px',
  margin: '20px 40px',
  padding: '20px',
  textAlign: 'center' as const,
};

const socialText = {
  color: '#002E5C',
  fontSize: '16px',
  lineHeight: '28px',
  margin: '0',
};

const signature = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '30px 40px',
  fontStyle: 'italic' as const,
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '30px 40px',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '18px',
  margin: '20px 40px',
  textAlign: 'center' as const,
};
