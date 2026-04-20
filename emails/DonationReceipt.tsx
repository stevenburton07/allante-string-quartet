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

interface DonationReceiptProps {
  donorName?: string;
  donorEmail: string;
  amount: number; // in cents
  date: string;
  transactionId: string;
}

export default function DonationReceipt({
  donorName,
  donorEmail,
  amount,
  date,
  transactionId,
}: DonationReceiptProps) {
  const formattedAmount = `$${(amount / 100).toFixed(2)}`;
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Html>
      <Head />
      <Preview>Thank you for your donation to the Allante String Quartet</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Thank You for Your Donation!</Heading>

          <Text style={text}>
            Dear {donorName || 'Generous Supporter'},
          </Text>

          <Text style={text}>
            We are deeply grateful for your generous donation to the Allante String Quartet. Your
            support helps us continue bringing live chamber music to the community.
          </Text>

          <Hr style={hr} />

          <Section>
            <Heading as="h2" style={h2}>
              Donation Receipt
            </Heading>

            <div style={receiptBox}>
              <Text style={receiptItem}>
                <strong>Donation Amount:</strong> {formattedAmount}
              </Text>
              <Text style={receiptItem}>
                <strong>Date:</strong> {formattedDate}
              </Text>
              <Text style={receiptItem}>
                <strong>Transaction ID:</strong> {transactionId}
              </Text>
              <Text style={receiptItem}>
                <strong>Donor Email:</strong> {donorEmail}
              </Text>
            </div>
          </Section>

          <Hr style={hr} />

          <Section>
            <Heading as="h2" style={h2}>
              Tax Information
            </Heading>
            <Text style={text}>
              The Allante String Quartet is a 501(c)(3) nonprofit organization.
            </Text>
            <Text style={text}>
              <strong>Tax ID:</strong> [Tax ID Number]
            </Text>
            <Text style={text}>
              Your donation is tax-deductible to the fullest extent allowed by law. No goods or
              services were provided in exchange for this contribution. Please retain this email as
              your official donation receipt for tax purposes.
            </Text>
          </Section>

          <Hr style={hr} />

          <Section>
            <Heading as="h2" style={h2}>
              Your Impact
            </Heading>
            <Text style={text}>
              Your generous contribution directly supports:
            </Text>
            <ul style={list}>
              <li style={listItem}>Free and low-cost community concerts</li>
              <li style={listItem}>Music education and outreach programs</li>
              <li style={listItem}>Commissioning new works for string quartet</li>
              <li style={listItem}>Supporting local musicians and composers</li>
            </ul>
          </Section>

          <Hr style={hr} />

          <Text style={text}>
            Thank you again for your support. We couldn't do this without generous donors like you.
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
            Website: www.allantequartet.com
            <br />
            <br />
            This is an automated receipt. Please do not reply to this email.
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

const receiptBox = {
  backgroundColor: '#f6f9fc',
  border: '2px solid #D14377',
  borderRadius: '8px',
  margin: '20px 40px',
  padding: '20px',
};

const receiptItem = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '8px 0',
};

const list = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '12px 40px',
  paddingLeft: '20px',
};

const listItem = {
  margin: '8px 0',
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
