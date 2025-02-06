import { useEffect, useState } from "react";

export default function useMountTransition(mounted: boolean, delay: number) {
  const [transitioned, setTransitioned] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (mounted && !transitioned) {
      timeoutId = setTimeout(() => setTransitioned(true), 1); // Small Delay to Ensure Transition Effect
    } else if (!mounted && transitioned) {
      timeoutId = setTimeout(() => setTransitioned(false), delay);
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [delay, mounted, transitioned]);

  return transitioned;
}
