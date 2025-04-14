'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { type UseEmblaCarouselType } from 'embla-carousel-react';

type CarouselApi = UseEmblaCarouselType[1];

interface AutoPlayCarouselProps {
  children: React.ReactNode;
  interval?: number;
  className?: string;
  opts?: any;
}

export function AutoPlayCarousel({
  children,
  interval = 5000,
  className,
  opts = {},
}: AutoPlayCarouselProps) {
  const [api, setApi] = useState<CarouselApi | undefined>(undefined);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!api || isPaused) return;

    const intervalId = setInterval(() => {
      api.scrollNext();
    }, interval);

    return () => clearInterval(intervalId);
  }, [api, interval, isPaused]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Carousel
        setApi={setApi}
        className={className}
        opts={{
          loop: true,
          ...opts,
        }}
      >
        <CarouselContent>{children}</CarouselContent>
        <div className="absolute inset-0 flex items-center justify-between p-4">
          <CarouselPrevious className="relative left-0 z-10 translate-y-0" />
          <CarouselNext className="relative right-0 z-10 translate-y-0" />
        </div>
      </Carousel>
    </div>
  );
}
