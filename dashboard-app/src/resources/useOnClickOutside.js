import { useEffect } from 'react';

export function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };


    const timer = setTimeout(() => {
      document.addEventListener('mousedown', listener);
      document.addEventListener('touchstart', listener);
    }, 0);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };

  }, [ref, handler]);
}
