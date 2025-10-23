
'use client';

import type { Candidate, CallStatus } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface ResultsTableProps {
  candidates: Candidate[];
  onCall: (candidate: Candidate) => void;
  onSelectRow: (candidate: Candidate) => void;
  isCalling: Record<number, boolean>;
  selectedCandidateId?: number | null;
}

const statusStyles: Record<CallStatus, string> = {
  New: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border-blue-300/50',
  Calling: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-300/50 animate-pulse',
  Interested: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-300/50',
  'No Answer': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-300/50',
  Error: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-red-300/50',
  Completed: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 border-purple-300/50',
};

export function ResultsTable({
  candidates,
  onCall,
  onSelectRow,
  isCalling,
  selectedCandidateId
}: ResultsTableProps) {
  return (
    <div className="w-full">
        <h2 className="text-lg font-headline mb-2">Results</h2>
        <ScrollArea className="rounded-md border h-[calc(100vh-450px)] min-h-[300px]">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Property / Address</TableHead>
                <TableHead>Dealer</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Call Summary</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {candidates.length > 0 ? (
                candidates.map((candidate, index) => (
                  <TableRow 
                    key={candidate.id} 
                    onClick={() => onSelectRow(candidate)}
                    className={cn("cursor-pointer", selectedCandidateId === candidate.id && "bg-secondary/50")}
                  >
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div className="font-medium">{candidate.property_title}</div>
                      <div className="text-xs text-muted-foreground">{candidate.address}</div>
                    </TableCell>
                    <TableCell>{candidate.dealer_name}</TableCell>
                    <TableCell>{candidate.phone_numbers[0]}</TableCell>
                    <TableCell>
                      <a 
                        href={candidate.source_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-primary hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {new URL(candidate.source_url).hostname}
                      </a>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(statusStyles[candidate.status] || '')}>
                        {candidate.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{candidate.last_call_summary}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onCall(candidate);
                        }}
                        disabled={isCalling[candidate.id]}
                      >
                        {isCalling[candidate.id] ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Phone className="h-4 w-4" />
                        )}
                        <span className="ml-2 hidden sm:inline">
                          Call
                        </span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
