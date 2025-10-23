
'use client';

import type { Candidate } from '@/lib/types';
import { DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import React from 'react';

interface DetailViewProps {
  candidate: Candidate | null;
  isCalling?: boolean;
}

const TranscriptLine = ({ line }: { line: string }) => {
    const [speaker, ...rest] = line.split(':');
    const content = rest.join(':').trim();
    const isUser = speaker.trim().toLowerCase() === 'user';
    return (
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
            <span className={`text-xs font-bold ${isUser ? 'text-blue-500' : 'text-green-500'}`}>{speaker}</span>
            <p className="text-sm">{content}</p>
        </div>
    );
};


export function DetailView({ candidate, isCalling }: DetailViewProps) {
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [candidate?.call_transcript]);


  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-headline text-xl flex items-center">
            {isCalling && <Loader2 className="inline-block mr-2 h-5 w-5 animate-spin" />}
            Call with: {candidate?.dealer_name || 'N/A'}
        </DialogTitle>
      </DialogHeader>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow min-h-0">
        <div className="md:col-span-1 space-y-4">
            <h3 className="font-semibold text-muted-foreground">Property & Contact</h3>
            <div className="font-mono text-sm space-y-1 text-foreground/80">
                <p><span className="font-semibold text-muted-foreground">Property:</span> {candidate?.property_title}</p>
                <p><span className="font-semibold text-muted-foreground">Dealer:</span> {candidate?.dealer_name}</p>
                <p><span className="font-semibold text-muted-foreground">Phones:</span> {candidate?.phone_numbers?.join(', ')}</p>
                <p><span className="font-semibold text-muted-foreground">Source:</span> <a href={candidate?.source_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{candidate?.source_url ? new URL(candidate.source_url).hostname : ''}</a></p>
                <p><span className="font-semibold text-muted-foreground">Status:</span> {candidate?.status}</p>
            </div>
             <h3 className="font-semibold text-muted-foreground pt-4 border-t">Call Summary</h3>
             <p className="text-sm text-foreground/90 bg-secondary/50 p-3 rounded-md min-h-[100px]">
                {isCalling && candidate?.status === 'Calling' ? (
                    <span className="text-muted-foreground italic flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Generating summary...
                    </span>
                ) : (
                    candidate?.last_call_summary || <span className="text-muted-foreground italic">Summary will appear here after the call.</span>
                )}
             </p>
        </div>
        <div className="md:col-span-2 flex flex-col min-h-0">
             <h3 className="font-semibold text-muted-foreground mb-2">Live Call Transcript</h3>
             <ScrollArea className="flex-grow rounded-md border bg-muted/20" viewportRef={scrollAreaRef}>
                <div className="p-4 space-y-4">
                  {candidate?.call_transcript ? (
                     candidate.call_transcript.split('\n').filter(line => line.trim()).map((line, index) => (
                      <TranscriptLine key={index} line={line} />
                    ))
                  ) : (
                    <div className="text-muted-foreground italic h-full flex items-center justify-center">
                      {isCalling ? "Call is in progress..." : "Call has not been placed."}
                    </div>
                  )}
                </div>
            </ScrollArea>
        </div>
      </div>
      <DialogFooter className="mt-4">
        <DialogClose asChild>
            <Button variant="outline">
              Close
            </Button>
        </DialogClose>
      </DialogFooter>
    </>
  );
}
