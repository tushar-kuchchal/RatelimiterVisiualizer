import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface AdUnitProps {
  slot: string;
  format?: string;
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function AdUnit({
  slot,
  format = 'auto',
  responsive = true,
  className = '',
  style,
}: AdUnitProps) {
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch (err) {
      console.error('AdSense push failed', err);
    }
  }, []);

  return (
    <ins
      className={`adsbygoogle block ${className}`}
      style={{ display: 'block', ...style }}
      data-ad-client="ca-pub-1737804257201478"
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive ? 'true' : 'false'}
    />
  );
}
