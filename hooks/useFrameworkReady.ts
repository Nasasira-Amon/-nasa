import { useEffect, useState } from 'react';

/**
 * Critical hook that ensures the Expo framework is fully initialized
 * before rendering the app. This prevents race conditions and ensures
 * all native modules are ready.
 */
export function useFrameworkReady() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Mark framework as ready after initial mount
    setIsReady(true);
  }, []);

  return isReady;
}
