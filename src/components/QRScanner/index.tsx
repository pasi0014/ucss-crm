import React, { useRef, useState } from 'react';
import jsQR, { QRCode } from 'jsqr';
import { Button } from '@chakra-ui/react';

// interface QRScannerState {
//   scannedData: string | null;
// }

function QRScanner(): JSX.Element {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [scannedData, setScannedData] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      console.log('Start Camera');
      console.log({ test: navigator.mediaDevices });
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      console.log({ stream });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      console.log({ videoRef });
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const handleScan = async () => {
    const video = videoRef.current;
    console.log({ video });

    if (video && video.readyState === video.HAVE_ENOUGH_DATA) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      canvas.width = video.videoWidth || 0;
      canvas.height = video.videoHeight || 0;

      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code: QRCode | null = jsQR(imageData.data, canvas.width, canvas.height);

        if (code) {
          setScannedData(code.data);
        }
      }
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream | null;
    console.log({ stream });
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  return (
    <div>
      <h1>QR Code Scanner</h1>
      <Button onClick={startCamera}>Start Camera</Button>
      <Button onClick={handleScan}>Scan QR Code</Button>
      <Button onClick={stopCamera}>Stop Camera</Button>
      {scannedData && <p>Scanned Data: {scannedData}</p>}
      <video ref={videoRef} autoPlay playsInline style={{ display: 'block' }} />
    </div>
  );
}

export default QRScanner;
