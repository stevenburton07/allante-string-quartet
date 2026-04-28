import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface ConcertConfirmationProps {
  customerName: string;
  concertTitle: string;
  concertDate: string;
  concertTime: string;
  location: string;
  venue?: string;
  ticketQuantity: number;
  totalAmount: number; // in cents
  orderId: string;
  qrCodeUrl: string;
}

export default function ConcertConfirmation({
  customerName,
  concertTitle,
  concertDate,
  concertTime,
  location,
  venue,
  ticketQuantity,
  totalAmount,
  orderId,
  qrCodeUrl,
}: ConcertConfirmationProps) {
  const isFree = totalAmount === 0;
  const formattedAmount = isFree ? 'Free' : `$${(totalAmount / 100).toFixed(2)}`;
  const formattedDate = new Date(concertDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Html>
      <Head />
      <Preview>Your concert registration is confirmed! Details inside.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>
            {isFree ? 'Registration Confirmed!' : 'Your Tickets Are Confirmed!'}
          </Heading>

          <Text style={text}>Dear {customerName},</Text>

          <Text style={text}>
            Thank you for {isFree ? 'registering' : 'purchasing tickets'} for our upcoming concert.
            We look forward to seeing you there!
          </Text>

          <Hr style={hr} />

          <Section>
            <Heading as="h2" style={h2}>
              Event Details
            </Heading>

            <div style={detailsBox}>
              <Text style={detailItem}>
                <strong>Concert:</strong> {concertTitle}
              </Text>
              <Text style={detailItem}>
                <strong>Date:</strong> {formattedDate}
              </Text>
              <Text style={detailItem}>
                <strong>Time:</strong> {concertTime}
              </Text>
              <Text style={detailItem}>
                <strong>Location:</strong> {location}
                {venue && ` - ${venue}`}
              </Text>
              <Text style={detailItem}>
                <strong>{isFree ? 'Seats:' : 'Tickets:'}</strong> {ticketQuantity}
              </Text>
              {!isFree && (
                <Text style={detailItem}>
                  <strong>Total Paid:</strong> {formattedAmount}
                </Text>
              )}
              <Text style={detailItem}>
                <strong>Order ID:</strong> {orderId}
              </Text>
            </div>
          </Section>

          <Hr style={hr} />

          <Section>
            <Heading as="h2" style={h2}>
              Your QR Code
            </Heading>

            <div style={qrBox}>
              <Img src={qrCodeUrl} alt="Ticket QR Code" style={qrCode} />
              <Text style={qrText}>
                Present this QR code at check-in (printed or on your phone)
              </Text>
            </div>

            <Text style={text}>
              <strong>Important:</strong> This QR code is unique to your order. Please keep this email
              safe and bring it with you to the concert.
            </Text>
          </Section>

          <Hr style={hr} />

          <Text style={text}>
            We can't wait to see you there! If you have any questions, please don't hesitate to reach
            out.
          </Text>

          <Text style={signature}>
            See you soon,
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
            Order ID: {orderId}
            <br />
            <br />
            This is an automated confirmation. Please save this email for your records.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

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

const detailsBox = {
  backgroundColor: '#f6f9fc',
  border: '2px solid #D14377',
  borderRadius: '8px',
  margin: '20px 40px',
  padding: '20px',
};

const detailItem = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '8px 0',
};

const qrBox = {
  textAlign: 'center' as const,
  margin: '20px 40px',
  padding: '20px',
  backgroundColor: '#f6f9fc',
  borderRadius: '8px',
};

const qrCode = {
  width: '250px',
  height: '250px',
  margin: '0 auto',
  display: 'block',
};

const qrText = {
  color: '#666',
  fontSize: '14px',
  marginTop: '15px',
  fontStyle: 'italic' as const,
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
