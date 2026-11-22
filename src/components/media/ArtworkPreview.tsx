'use client';

import React, { useEffect, useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { isLocalImage, readLocalImage } from '../../lib/localImageStorage';

export function useArtworkUrl(reference: string | undefined): string | null {
  const [cached, setCached] = useState<{ reference: string; url: string } | null>(null);
  useEffect(() => {
    if (!reference || !isLocalImage(reference)) return;
    let cancelled = false;
    let url: string | undefined;
    readLocalImage(reference)
      .then(image => {
        if (cancelled || !image) return;
        url = URL.createObjectURL(image.blob);
        setCached({ reference, url });
      })
      .catch(() => { /* Missing local image shows a placeholder instead. */ });
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [reference]);
  if (!reference) return null;
  return isLocalImage(reference) ? cached?.reference === reference ? cached.url : null : reference;
}

export const ArtworkPreview: React.FC<{
  source?: string;
  alt: string;
  className?: string;
}> = ({ source, alt, className = '' }) => {
  const url = useArtworkUrl(source);
  const [bad, setBad] = useState<{ src: string; failed: boolean } | null>(null);
  return url && !(bad?.src === url && bad.failed) ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt={alt} className={className} onError={() => setBad({ src: url, failed: true })} />
  ) : (
    <div className="h-full w-full flex flex-col items-center justify-center gap-2 bg-[#181d27] text-gray-400 text-xs text-center p-3">
      <ImageIcon className="h-7 w-7 text-gray-500" />
      <span>{isLocalImage(source) ? 'Local picture unavailable on this device' : 'Image preview unavailable'}</span>
    </div>
  );
};
