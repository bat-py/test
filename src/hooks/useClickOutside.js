import { useEffect } from 'react';

export const useClickOutside = (close, elementRef) => {
  useEffect(() => {
    const handleClickOutside = event => {
      const target = event.target;
      if (elementRef.current && !elementRef.current.contains(target)) {
        close();
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [elementRef]);
};
