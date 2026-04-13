'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';

const SUGGESTED_AMOUNTS = [
  { label: '$25', value: 25 },
  { label: '$50', value: 50 },
  { label: '$100', value: 100 },
  { label: '$250', value: 250 },
];

// Venmo username (without @ symbol)
const VENMO_USERNAME = 'allantestringquartet';

export default function DonationForm() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(50); // Default $50
  const [customAmount, setCustomAmount] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [isMobile, setIsMobile] = useState(true); // Default to true to avoid layout shift

  useEffect(() => {
    // Detect if user is on mobile device
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod|android/.test(userAgent) || window.innerWidth < 768;
    };
    setIsMobile(checkMobile());
  }, []);

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setIsCustom(false);
    setCustomAmount('');
  };

  const handleCustomClick = () => {
    setIsCustom(true);
    setSelectedAmount(null);
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setCustomAmount(value);
  };

  const handleVenmoDonate = () => {
    // Determine final amount
    let finalAmount: number;

    if (isCustom) {
      const amount = parseFloat(customAmount);
      if (isNaN(amount) || amount < 1) {
        alert('Please enter a valid donation amount of at least $1');
        return;
      }
      finalAmount = amount;
    } else {
      if (!selectedAmount) {
        alert('Please select a donation amount');
        return;
      }
      finalAmount = selectedAmount;
    }

    // Create Venmo deep link
    const venmoUrl = `venmo://paycharge?txn=pay&recipients=${VENMO_USERNAME}&amount=${finalAmount}&note=${encodeURIComponent(
      'Donation to Allante String Quartet'
    )}`;

    // Try to open Venmo app (works on mobile)
    window.location.href = venmoUrl;

    // Fallback: after a delay, show instructions for desktop users
    setTimeout(() => {
      // If still on page (Venmo app didn't open), user might be on desktop
      alert(
        `To complete your donation:\n\n1. Open Venmo on your phone\n2. Send $${finalAmount} to @${VENMO_USERNAME}\n3. Add note: "Donation to Allante String Quartet"\n\nThank you for your support!`
      );
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Venmo Info Banner */}
      <div className="bg-light-blue/20 rounded-lg p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.83 4.5c.8 1.2 1.17 2.5 1.17 4.17 0 5.17-4.4 11.83-7.83 16.33h-5L4.5 7.5l4.83-.5 2 12.67c1.83-2.67 4.17-7 4.17-10 0-1.17-.17-2-.67-2.67L19.83 4.5z"/>
          </svg>
          <span className="font-semibold text-primary">Donate via Venmo</span>
        </div>
        <p className="text-sm text-gray-700">
          Quick and easy donations through Venmo: <strong>@{VENMO_USERNAME}</strong>
        </p>
      </div>

      {!isMobile ? (
        /* Desktop: Show QR Code */
        <div className="text-center py-8">
          <p className="text-gray-700 mb-6">
            Scan the QR code with your phone to donate via Venmo
          </p>
          <div className="flex justify-center">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`https://venmo.com/u/${VENMO_USERNAME}`)}`}
              alt="Venmo QR Code"
              width={250}
              height={250}
              className="border-4 border-gray-200 rounded-lg"
            />
          </div>
        </div>
      ) : (
        /* Mobile: Show full form */
        <>
          <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select Donation Amount
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {SUGGESTED_AMOUNTS.map((amount) => (
            <button
              key={amount.value}
              type="button"
              onClick={() => handleAmountSelect(amount.value)}
              className={`py-4 px-6 rounded-lg border-2 font-semibold transition-all ${
                selectedAmount === amount.value && !isCustom
                  ? 'border-primary bg-primary text-white'
                  : 'border-gray-300 text-gray-700 hover:border-primary hover:text-primary'
              }`}
            >
              {amount.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">or</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Custom Amount
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
            $
          </span>
          <input
            type="text"
            value={customAmount}
            onChange={handleCustomAmountChange}
            onFocus={handleCustomClick}
            placeholder="Enter amount"
            className={`w-full pl-8 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
              isCustom ? 'border-primary' : 'border-gray-300'
            }`}
          />
        </div>
        <p className="mt-1.5 text-sm text-gray-500">Minimum donation: $1.00</p>
      </div>

      <Button
        type="button"
        variant="primary"
        size="lg"
        fullWidth
        onClick={handleVenmoDonate}
      >
        Donate with Venmo
      </Button>

      <div className="text-center">
        <p className="text-sm text-gray-600 mb-3">
          Don't have Venmo?
        </p>
        <p className="text-sm text-gray-700">
          <strong>Contact us</strong> at{' '}
          <a href="mailto:allantestringquartet@gmail.com" className="text-primary hover:text-secondary">
            allantestringquartet@gmail.com
          </a>
          <br />
          <span className="text-gray-600 text-xs">for other donation options</span>
        </p>
      </div>
        </>
      )}
    </div>
  );
}
