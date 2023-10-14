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

interface QRScannerProps {
  onSuccess: (code: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onSuccess }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [scannedData, setScannedData] = useState<string>('');

  const startCamera = async () => {
    try {
      onOpen();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: {
            max: 1280,
          },
          height: {
            max: 720,
          },
          facingMode: 'environment',
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error: any) {
      console.error('Error accessing camera:', { ...error });
      toast({
        title: 'Camera error!',
        description: `There was an error while trying to initialize camera`,
        position: 'top-right',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
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
          onSuccess(code.data);
          stopCamera();
        }
      }
    }
  };

  const stopCamera = () => {
    onClose();
    const stream = videoRef.current?.srcObject as MediaStream | null;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  return (
    <div className="w-full">
      <Button
        onClick={startCamera}
        colorScheme="yellow"
        className="w-full"
        size={{ base: 'sm', md: 'md' }}
      >
        Search by QR code
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
        isCentered
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>QR Scan</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box className="w-full h-full flex flex-col">
              <Box className="mb-5 w-full">
                Once QR code is in the camera. Press <b>Scan</b>
              </Box>
              <Box className="w-full h-full mx-auto">
                <video
                  className="w-10/12 h-92 block"
                  ref={videoRef}
                  autoPlay
                  playsInline
                  style={{ display: 'block' }}
                />
              </Box>
            </Box>
          </ModalBody>

          <ModalFooter>
            {scannedData && <div>{scannedData}</div>}

            <Button
              variant="solid"
              colorScheme="green"
              mr={3}
              onClick={() => handleScan()}
            >
              Scan
            </Button>
            <Button colorScheme="blue" mr={3} onClick={stopCamera}>
              Stop Scanning
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default QRScanner;
