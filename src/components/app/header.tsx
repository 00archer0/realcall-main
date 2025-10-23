'use client';

import { CallCastLogo } from '@/components/icons';

export function AppHeader() {
  return (
    <header className="flex items-center gap-4">
      <CallCastLogo className="h-10 w-10 text-primary" />
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground font-headline">
          CallCast AI
        </h1>
        <p className="text-muted-foreground">
          Enter a free-text query to find and automatically contact real-estate dealers.
        </p>
      </div>
    </header>
  );
}
