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
import { cn } from '@/lib/utils';

type CarouselApi = UseEmblaCarouselType[1];

interface AutoPlayCarouselProps {
  children: React.ReactNode;
  interval?: number;
  className?: string;
  opts?: any;
  showControls?: boolean;
}

export function AutoPlayCarousel({
  children,
  interval = 5000,
  className,
  opts = {},
  showControls = true,
}: AutoPlayCarouselProps) {
  const [api, setApi] = useState<CarouselApi | undefined>(undefined);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial value
    checkMobile();

    // Add event listener for resize
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!api || isPaused) return;

    const intervalId = setInterval(() => {
      api.scrollNext();
    }, interval);

    return () => clearInterval(intervalId);
  }, [api, interval, isPaused]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  // Also pause on touch for mobile devices
  const handleTouchStart = () => setIsPaused(true);
  const handleTouchEnd = () => setIsPaused(false);

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="w-full"
    >
      <Carousel
        setApi={setApi}
        className={cn('w-full', className)}
        opts={{
          loop: true,
          dragFree: isMobile,
          ...opts,
        }}
      >
        <CarouselContent>{children}</CarouselContent>

        {showControls && (
          <div
            className={cn(
              'absolute inset-0 flex items-center justify-between',
              isMobile ? 'px-2' : 'p-4',
            )}
          >
            <CarouselPrevious
              className={cn(
                'relative left-0 z-10 translate-y-0',
                isMobile ? 'h-8 w-8' : '',
              )}
            />
            <CarouselNext
              className={cn(
                'relative right-0 z-10 translate-y-0',
                isMobile ? 'h-8 w-8' : '',
              )}
            />
          </div>
        )}
      </Carousel>
    </div>
  );
}
