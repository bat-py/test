import { useState, useEffect } from 'react';

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    isMobile: false,
  });
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        isMobile: document.body.clientWidth < 768,
      });
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return windowSize;
};
