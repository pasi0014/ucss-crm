/**
 * useIsMobile
 * Custom hook to check if window width is mobile
 */
import { useState, useEffect } from "react";

const useIsMobile = () => {
  const [windowSize, setWindowSize] = useState<any>({});
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (window.innerWidth < 576) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, [windowSize]);

  return isMobile;
};

export default useIsMobile;
