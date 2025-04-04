'use client';

import React, { useEffect, useRef, useState } from 'react';
import { PreviewRendererProps } from './types';
import Renderer from '../renderer';
import { Notifier } from './notifier';

const PreviewRenderer = ({ data, params, searchParams }: PreviewRendererProps) => {
  const [currentHighlight, setCurrentHighlight] = useState<string>();

  const notifier = useRef<Notifier>(null) as React.MutableRefObject<Notifier>;

  const customer = data.previewContext?.customerName ?? 'demo';

  const handleRefresh = () => {
    window.location.href = window.location.href;
  };

  const handleEndHighlight = () => setCurrentHighlight(undefined);

  useEffect(() => {
    const handleHighlight = ({ item }: { item: string }) => {
      if (currentHighlight !== item) {
        setCurrentHighlight(item);
      }
    };
    if (data?.previewId && !notifier.current) {
      notifier.current = new Notifier(
        { previewId: data.previewId, customer },
        {
          Refresh: handleRefresh,
          Highlight: handleHighlight,
          EndHighlight: handleEndHighlight,
        },
      );
      notifier.current.connect();
    }
  }, [currentHighlight, data?.previewId, customer]);

  if (!data) return <></>;

  return (
    <Renderer data={data} params={params} searchParams={searchParams} currentHighlight={currentHighlight as string} />
  );
};

export default PreviewRenderer;
