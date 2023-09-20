import React, { useRef, useState } from 'react';
import jsQR, { QRCode } from 'jsqr';
import { Button, useDisclosure } from '@chakra-ui/react';
import { Modal } from '@chakra-ui/react';
import { ModalOverlay } from '@chakra-ui/react';
import { ModalContent } from '@chakra-ui/react';
import { ModalHeader } from '@chakra-ui/react';
import { ModalCloseButton } from '@chakra-ui/react';
import { ModalBody } from '@chakra-ui/react';
import { ModalFooter } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';

function QRScanner(): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [showVideo, setShowVideo] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: {
            min: 1280,
            ideal: 1920,
            max: 2560,
          },
          height: {
            min: 720,
            ideal: 1080,
            max: 1440,
          },
          facingMode: {
            exact: 'environment', // Use the back camera if available
          },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        onOpen();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const handleScan = async () => {
    const video = videoRef.current;

    if (video && video.readyState === video.HAVE_ENOUGH_DATA) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      canvas.width = video.videoWidth || 0;
      canvas.height = video.videoHeight || 0;

      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height,
        );
        const code: QRCode | null = jsQR(
          imageData.data,
          canvas.width,
          canvas.height,
        );

        if (code) {
          setScannedData(code.data);
          onClose();
        }
      }
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream | null;

    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      onClose();
    }
  };

  return (
    <div>
      <Button onClick={startCamera}>Start Camera</Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
        isCentered
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box className="w-full h-full flex flex-col">
              <Box className="mb-5 w-full">
                Once QR code is in the camera. Press <b>Scan</b>
              </Box>
              <Box className="w-full h-full">
                <video
                  className="w-full h-full block"
                  ref={videoRef}
                  autoPlay
                  playsInline
                />
              </Box>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={stopCamera}>
              Stop Scanning
            </Button>
            <Button variant="green" onClick={handleScan}>
              Scan
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default QRScanner;
