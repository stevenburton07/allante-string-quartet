'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import Button from '@/components/ui/Button';

interface QRScannerProps {
  onScan: (data: string) => void;
  onError?: (error: string) => void;
}

export default function QRScanner({ onScan, onError }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const elementId = 'qr-reader';

  const startScanning = async () => {
    try {
      setError('');
      setIsScanning(true);

      const scanner = new Html5Qrcode(elementId);
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' }, // Use back camera on mobile
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          // Success callback
          onScan(decodedText);
        },
        (errorMessage) => {
          // Error callback (called frequently, so we don't show these)
        }
      );
    } catch (err: any) {
      console.error('Error starting scanner:', err);
      const errorMsg = 'Failed to start camera. Please check camera permissions.';
      setError(errorMsg);
      setIsScanning(false);
      if (onError) {
        onError(errorMsg);
      }
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
        scannerRef.current = null;
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
    }
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      <div
        id={elementId}
        className={`rounded-lg overflow-hidden ${!isScanning ? 'hidden' : ''}`}
        style={{ maxWidth: '500px', margin: '0 auto' }}
      />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {!isScanning ? (
        <div className="text-center">
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={startScanning}
          >
            Start Camera
          </Button>
          <p className="text-sm text-gray-600 mt-4">
            Point your camera at a ticket QR code to check in
          </p>
        </div>
      ) : (
        <div className="text-center">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={stopScanning}
          >
            Stop Camera
          </Button>
        </div>
      )}
    </div>
  );
}
