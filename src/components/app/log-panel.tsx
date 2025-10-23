
'use client';

import * as React from 'react';
import type { LogEntry } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface LogPanelProps {
  logs: LogEntry[];
  onClear: () => void;
}

export function LogPanel({ logs, onClear }: LogPanelProps) {
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  const viewportRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <Card className="flex-grow flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-headline">Verbose Log</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClear} className="h-8 w-8">
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Clear logs</span>
        </Button>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col min-h-0">
        <ScrollArea className="h-96 flex-grow rounded-md border" viewportRef={viewportRef}>
          <div className="p-4 font-mono text-xs" ref={scrollAreaRef}>
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <p className="text-muted-foreground">[{log.timestamp}]</p>
                  <p className="font-semibold">{log.message}</p>
                  {log.data && (
                    <pre className="mt-1 whitespace-pre-wrap text-muted-foreground bg-secondary/30 p-2 rounded-sm text-[10px] max-w-full overflow-x-auto">
                      {JSON.stringify(log.data, null, 2)}
                    </pre>
                  )}
                </div>
              ))
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <p>Logs will appear here...</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
