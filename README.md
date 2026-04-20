# Allante String Quartet Website

A modern, full-featured website for the Allante String Quartet serving Utah County, built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Public Pages**: Home, About, Concerts, Sunset Series, Hire, Donate, Contact
- **Concert Management System**: Admin panel for managing concerts (coming in Phase 3)
- **Ticketing System**: Secure ticket sales with QR code check-in (coming in Phase 5-7)
- **Payment Processing**: Stripe integration for donations and tickets
- **Email Automation**: Automated confirmation emails via Resend
- **Responsive Design**: Mobile-first design with custom brand colors

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL via Supabase
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **Email**: Resend with React Email templates
- **QR Codes**: qrcode & html5-qrcode

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (for database and auth)
- Stripe account (for payments)
- Resend account (for emails)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd allante_quartet
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your actual credentials:
- Supabase URL and keys
- Stripe API keys
- Resend API key
- Organization email

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
allante_quartet/
├── app/                      # Next.js App Router pages
│   ├── about/               # About page
│   ├── concerts/            # Concerts listing
│   ├── sunset-series/       # Sunset Series ticketing
│   ├── hire/                # Hire request form
│   ├── donate/              # Donation page
│   ├── contact/             # Contact form
│   ├── admin/               # Admin panel (Phase 3+)
│   └── api/                 # API routes (Phase 2+)
├── components/
│   ├── layout/              # Header, Footer, Navigation
│   ├── ui/                  # Reusable UI components
│   ├── forms/               # Form components (Phase 2+)
│   ├── concerts/            # Concert components (Phase 3+)
│   ├── ticketing/           # Ticketing components (Phase 5+)
│   └── admin/               # Admin components (Phase 3+)
├── lib/
│   ├── supabase/            # Supabase client setup
│   ├── stripe.ts            # Stripe configuration (Phase 4+)
│   ├── email.ts             # Email utilities (Phase 2+)
│   └── qrcode.ts            # QR code utilities (Phase 5+)
├── emails/                  # React Email templates (Phase 2+)
├── types/                   # TypeScript type definitions
├── supabase/
│   └── migrations/          # Database migrations (Phase 3+)
└── public/                  # Static assets
```

## Development Roadmap

### ✅ Phase 0: Project Setup (COMPLETED)
- Next.js initialization
- Tailwind CSS configuration
- Supabase setup
- Core layout components
- All dependencies installed

### ✅ Phase 1: Static Pages (COMPLETED)
- Home page with hero and CTAs
- About page with quartet information
- Concerts page (placeholder)
- Sunset Series page with event details
- Hire page with service options
- Donate page with giving information
- Contact page with contact info
- Reusable UI components (Button, Input, Select, Textarea)

### 🔄 Phase 2: Forms & Email Integration (NEXT)
- Hire quote request form
- Contact form
- Email templates with React Email
- Resend integration
- Form validation with Zod

### 📋 Phase 3: Admin Panel & Concert CMS
- Admin authentication
- Concert CRUD operations
- Image upload to Supabase Storage
- Protected admin routes
- Public concert display

### 📋 Phase 4: Donation System
- Donation form with Stripe
- Custom amount input
- Receipt email automation
- Success page

### 📋 Phase 5-6: Sunset Series Ticketing
- Event management
- Stripe Checkout integration
- QR code generation
- Confirmation emails with location reveal
- Location privacy enforcement
- Email template customization

### 📋 Phase 7: QR Check-in System
- Web-based QR scanner
- Ticket verification API
- Orders dashboard
- Manual check-in fallback
- Attendance tracking

### 📋 Phase 8: Testing & Deployment
- End-to-end testing
- Security audit
- Performance optimization
- Vercel deployment
- Stripe webhook configuration

## Brand Colors

- **Primary**: #002E5C (Dark Blue)
- **Secondary**: #D14377 (Rose/Magenta)
- **Light Gray**: #f2f2f2
- **Light Blue**: #93C4F5

## Environment Variables

See `.env.example` for all required environment variables.

**Important**: Never commit `.env.local` to version control. All secrets should be stored securely.

## Database Setup

Database migrations will be created in Phase 3 and later. To run migrations:

```bash
# Instructions will be added in Phase 3
```

## Deployment

This project is optimized for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy!

See the full deployment guide in the implementation plan.

## Contributing

This is a private project for the Allante String Quartet.

## License

All rights reserved © 2026 Allante String Quartet

## Support

For questions or issues, contact: allantestringquartet@gmail.com
