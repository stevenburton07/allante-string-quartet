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

interface TicketConfirmationProps {
  customerName: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  rainDate?: string;
  locationAddress: string;
  locationCity: string;
  locationState: string;
  locationZip: string;
  ticketQuantity: number;
  totalAmount: number; // in cents
  orderId: string;
  qrCodeUrl: string; // Data URL of QR code
}

export default function TicketConfirmation({
  customerName,
  eventTitle,
  eventDate,
  eventTime,
  rainDate,
  locationAddress,
  locationCity,
  locationState,
  locationZip,
  ticketQuantity,
  totalAmount,
  orderId,
  qrCodeUrl,
}: TicketConfirmationProps) {
  const formattedAmount = `$${(totalAmount / 100).toFixed(2)}`;
  const formattedDate = new Date(eventDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedRainDate = rainDate
    ? new Date(rainDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <Html>
      <Head />
      <Preview>Your Sunset Series tickets are confirmed! Event details inside.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Your Tickets Are Confirmed!</Heading>

          <Text style={text}>Dear {customerName},</Text>

          <Text style={text}>
            Thank you for purchasing tickets to the Sunset Series. We're thrilled to have you join
            us for an unforgettable evening of chamber music in nature!
          </Text>

          <Hr style={hr} />

          {/* Event Details */}
          <Section>
            <Heading as="h2" style={h2}>
              Event Details
            </Heading>

            <div style={detailsBox}>
              <Text style={detailItem}>
                <strong>Event:</strong> {eventTitle}
              </Text>
              <Text style={detailItem}>
                <strong>Date:</strong> {formattedDate}
              </Text>
              <Text style={detailItem}>
                <strong>Time:</strong> {eventTime}
              </Text>
              {formattedRainDate && (
                <Text style={detailItem}>
                  <strong>Rain Date:</strong> {formattedRainDate}
                </Text>
              )}
              <Text style={detailItem}>
                <strong>Tickets:</strong> {ticketQuantity} {ticketQuantity === 1 ? 'ticket' : 'tickets'}
              </Text>
              <Text style={detailItem}>
                <strong>Total Paid:</strong> {formattedAmount}
              </Text>
              <Text style={detailItem}>
                <strong>Order ID:</strong> {orderId}
              </Text>
            </div>
          </Section>

          <Hr style={hr} />

          {/* Location Information */}
          <Section>
            <Heading as="h2" style={h2}>
              📍 Event Location
            </Heading>

            <div style={locationBox}>
              <Text style={locationText}>
                <strong>{locationAddress}</strong>
                <br />
                {locationCity}, {locationState} {locationZip}
              </Text>
            </div>

            <Text style={text}>
              Please arrive <strong>15 minutes early</strong> to allow time for parking and check-in.
              Detailed hiking and parking instructions will be sent in a follow-up email closer to the
              event date.
            </Text>
          </Section>

          <Hr style={hr} />

          {/* QR Code Ticket */}
          <Section>
            <Heading as="h2" style={h2}>
              Your Ticket QR Code
            </Heading>

            <div style={qrBox}>
              <Img src={qrCodeUrl} alt="Ticket QR Code" style={qrCode} />
              <Text style={qrText}>
                Present this QR code at check-in (printed or on your phone)
              </Text>
            </div>

            <Text style={text}>
              <strong>Important:</strong> This QR code is unique to your order. Please keep this email
              safe and bring it with you to the event.
            </Text>
          </Section>

          <Hr style={hr} />

          {/* What to Bring */}
          <Section>
            <Heading as="h2" style={h2}>
              What to Bring
            </Heading>

            <div style={twoColumn}>
              <div style={column}>
                <Text style={columnHeading}>Essentials:</Text>
                <ul style={list}>
                  <li style={listItem}>Blanket or low-back chair</li>
                  <li style={listItem}>Water bottle</li>
                  <li style={listItem}>Sun protection</li>
                  <li style={listItem}>Layers for changing temperatures</li>
                </ul>
              </div>
              <div style={column}>
                <Text style={columnHeading}>Optional:</Text>
                <ul style={list}>
                  <li style={listItem}>Picnic snacks</li>
                  <li style={listItem}>Flashlight or headlamp</li>
                  <li style={listItem}>Camera</li>
                  <li style={listItem}>Bug spray</li>
                </ul>
              </div>
            </div>
          </Section>

          <Hr style={hr} />

          {/* Weather Notice */}
          {formattedRainDate && (
            <Section>
              <div style={weatherBox}>
                <Text style={weatherText}>
                  <strong>☁️ Weather Notice</strong>
                  <br />
                  If weather conditions require rescheduling, you'll be notified by email at least 24
                  hours in advance. The event will automatically move to the rain date: {formattedRainDate}.
                </Text>
              </div>
            </Section>
          )}

          {/* Footer */}
          <Text style={text}>
            We can't wait to see you there! If you have any questions, please don't hesitate to reach
            out.
          </Text>

          <Text style={signature}>
            See you at sunset,
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

const locationBox = {
  backgroundColor: '#93C4F5',
  borderRadius: '8px',
  margin: '20px 40px',
  padding: '20px',
  textAlign: 'center' as const,
};

const locationText = {
  color: '#002E5C',
  fontSize: '18px',
  lineHeight: '28px',
  margin: '0',
  fontWeight: 'bold' as const,
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

const twoColumn = {
  margin: '20px 40px',
  display: 'flex' as const,
  gap: '20px',
};

const column = {
  flex: '1',
};

const columnHeading = {
  color: '#002E5C',
  fontSize: '16px',
  fontWeight: 'bold' as const,
  marginBottom: '10px',
};

const list = {
  color: '#333',
  fontSize: '14px',
  lineHeight: '22px',
  paddingLeft: '20px',
  margin: '0',
};

const listItem = {
  margin: '6px 0',
};

const weatherBox = {
  backgroundColor: '#FFF9E6',
  border: '1px solid #FFE066',
  borderRadius: '8px',
  margin: '20px 40px',
  padding: '15px',
};

const weatherText = {
  color: '#666',
  fontSize: '14px',
  lineHeight: '22px',
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
