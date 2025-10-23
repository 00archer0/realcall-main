
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Candidate, LogEntry, Subquery, ChatMessage, CallStatus } from '@/lib/types';
import { generateSubqueriesAction, searchAction, initiateCallAction, getCallStatusAction } from '@/lib/actions';
import { getCallDataAction } from '@/lib/actions-call-data';
import { useToast } from "@/hooks/use-toast"
import { AppHeader } from '@/components/app/header';
import { QueryForm } from '@/components/app/query-form';
import { ResultsTable } from '@/components/app/results-table';
import { LogPanel } from '@/components/app/log-panel';
import { DetailView } from '@/components/app/detail-view';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const defaultQuery = '3 BHK Kothrud under 1.5Cr contact dealer';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default function Home() {
  const { toast } = useToast();
  
  // State management with localStorage persistence
  const [query, setQuery] = useState(defaultQuery);
  const [subqueries, setSubqueries] = useState<Subquery[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);

  const [isSearching, setIsSearching] = useState(false);
  const [isCalling, setIsCalling] = useState<Record<number, boolean>>({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Load state from localStorage on initial render
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('callcast_state');
      if (savedState) {
        const { query, subqueries, candidates, logs } = JSON.parse(savedState);
        setQuery(query || defaultQuery);
        setSubqueries(subqueries || []);
        setCandidates(candidates || []);
        setLogs(logs || []);
      } else {
         setLogs([{ timestamp: new Date().toLocaleTimeString(), message: 'Application initialized. Ready to search.'}]);
      }
    } catch (error) {
      console.error("Failed to load state from localStorage", error);
      setLogs([{ timestamp: new Date().toLocaleTimeString(), message: 'Could not load previous state. Application initialized.'}]);
    }
    setIsInitialized(true);
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (!isInitialized) return;
    try {
      // Don't save selectedCandidate or modal open state
      const stateToSave = { query, subqueries, candidates, logs };
      localStorage.setItem('callcast_state', JSON.stringify(stateToSave));
    } catch (error)
    {
      console.error("Failed to save state to localStorage", error);
    }
  }, [query, subqueries, candidates, logs, isInitialized]);


  const addLog = useCallback((message: string, data?: any) => {
    const newLog: LogEntry = {
      timestamp: new Date().toLocaleTimeString(),
      message,
      ...(data && { data: JSON.parse(JSON.stringify(data, (key, value) =>
        value instanceof Error ? { message: value.message, stack: value.stack, name: value.name } : value, 2)) }),
    };
    setLogs((prevLogs) => [newLog, ...prevLogs]);
  }, []);

  const clearState = () => {
    addLog('State cleared by user.');
    setQuery(defaultQuery);
    setSubqueries([]);
    setCandidates([]);
    setSelectedCandidate(null);
    setLogs([{ timestamp: new Date().toLocaleTimeString(), message: 'State cleared. New session started.' }]);
  };

  const clearLogs = () => {
    setLogs([{ timestamp: new Date().toLocaleTimeString(), message: 'Logs cleared by user.' }]);
  };
  
  const handleSearch = useCallback(async (currentQuery: string) => {
    setIsSearching(true);
    setSelectedCandidate(null);
    setCandidates([]);
    setSubqueries([]);
    setLogs((prev) => [{ timestamp: new Date().toLocaleTimeString(), message: '[START] Search process initiated.'}, ...prev]);
    addLog('Step 1: Generating subqueries from user query using AI...', { query: currentQuery });
    
    try {
      const generatedSubqueries = await generateSubqueriesAction(currentQuery);
      setSubqueries(generatedSubqueries);
      addLog(`Step 2: AI generated ${generatedSubqueries.length} optimized search queries.`, { 
        subqueries: generatedSubqueries.map(sq => sq.query_text) 
      });
      addLog('Step 3: Searching the internet using Tavily API...');
      
      // Add individual subquery logs
      generatedSubqueries.forEach((sq, idx) => {
        addLog(`  → Subquery ${idx + 1}: "${sq.query_text}"`);
      });

      const searchResults = await searchAction(generatedSubqueries);
      setCandidates(searchResults);
      
      const withPhones = searchResults.filter(c => c.phone_numbers[0] !== 'No phone number found').length;
      addLog(`Step 4: Web search complete. Found ${searchResults.length} property listings.`);
      addLog(`  → ${withPhones} listings with phone numbers`);
      addLog(`  → ${searchResults.length - withPhones} listings without phone numbers`);
      
      // Log top 3 results
      if (searchResults.length > 0) {
        addLog('Top results:');
        searchResults.slice(0, 3).forEach((c, idx) => {
          addLog(`  ${idx + 1}. ${c.property_title} - ${c.dealer_name} (${c.phone_numbers.length} phone numbers)`);
        });
      }
    } catch (error) {
      console.error(error);
      addLog('[ERROR] An error occurred during the search process.', { error });
      toast({
        variant: 'destructive',
        title: 'Search Failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
      });
    } finally {
      setIsSearching(false);
      addLog('[END] Search process finished.');
    }
  }, [addLog, toast]);

  const updateCandidate = useCallback((candidateId: number, updates: Partial<Candidate>) => {
    setCandidates(prev => {
      const newCandidates = prev.map(c => c.id === candidateId ? { ...c, ...updates } : c);
      const updatedCandidate = newCandidates.find(c => c.id === candidateId);
      if (updatedCandidate && selectedCandidate?.id === candidateId) {
        setSelectedCandidate(updatedCandidate);
      }
      return newCandidates;
    });
  }, [selectedCandidate]);
  
  const handleCall = useCallback(async (candidate: Candidate) => {
    if (isCalling[candidate.id]) return;
  
    setSelectedCandidate(candidate);
    setDetailModalOpen(true);
  
    setIsCalling(prev => ({...prev, [candidate.id]: true}));
    addLog(`[START] Live call process initiated for candidate #${candidate.id}`, { name: candidate.dealer_name });
  
    // Clear previous call data
    updateCandidate(candidate.id, {
      status: 'Calling',
      last_call_summary: 'Initiating live call with interactive voice bot...',
      call_transcript: '',
      recording_url: null,
    });
  
    let callSid = '';
    
    try {
      addLog(`Step 1: Initiating call via Twilio and connecting to voice bot webhook.`);
      const result = await initiateCallAction(candidate);
      callSid = result.callSid;
      addLog(`Step 2: Twilio call initiated with SID: ${callSid}. Polling for status and transcript...`);
      updateCandidate(candidate.id, {
        status: 'ringing',
        last_call_summary: `Call ringing... (SID: ${callSid})`,
      });
  
      // Poll for call status and transcript
      let callStatus: string = 'ringing';
      let isCallActive = true;

      while (isCallActive) {
        await sleep(2000); // Poll every 2 seconds
        
        // Fetch call status
        const { status } = await getCallStatusAction(callSid);
        
        // Fetch call data (transcript, summary, recording)
        try {
          const callData = await getCallDataAction(callSid);
          
          updateCandidate(candidate.id, {
            status: status as CallStatus,
            call_transcript: callData.transcript || '',
            last_call_summary: callData.summary || `Call ${status}...`,
            recording_url: callData.recordingUrl,
          });
        } catch (error) {
          // Call data might not be available yet, just update status
          if (selectedCandidate?.status !== status as CallStatus) {
            updateCandidate(candidate.id, { status: status as CallStatus });
          }
        }
        
        addLog(`Polling call status for SID ${callSid}: ${status}`);

        // Exit loop if the call is no longer in a pre-connected state
        if (!['queued', 'ringing', 'in-progress'].includes(status)) {
          isCallActive = false;
          callStatus = status;
        }
      }
  
      addLog(`Step 3: Call finished with status: ${callStatus}. Fetching final transcript and summary...`);
      
      // Fetch final call data
      await sleep(1000); // Give the status callback time to generate summary
      try {
        const finalCallData = await getCallDataAction(callSid);
        updateCandidate(candidate.id, {
          status: callStatus as CallStatus,
          call_transcript: finalCallData.transcript || '',
          last_call_summary: finalCallData.summary || `Call ${callStatus}.`,
          recording_url: finalCallData.recordingUrl,
        });
        addLog(`Step 4: Final transcript and summary retrieved.`);
      } catch (error) {
        console.error('Error fetching final call data:', error);
        updateCandidate(candidate.id, {
          status: callStatus as CallStatus,
          last_call_summary: `Call ${callStatus}. Could not retrieve transcript.`,
        });
      }
  
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'Could not complete the call.';
      addLog('[ERROR] An error occurred during the live call process.', { candidateId: candidate.id, error });
      toast({
        variant: 'destructive',
        title: 'Call Failed',
        description: errorMessage,
      });
      updateCandidate(candidate.id, { status: 'Error', last_call_summary: `Call failed: ${errorMessage}` });
    } finally {
      setIsCalling(prev => ({...prev, [candidate.id]: false}));
      addLog(`[END] Live call process finished for candidate #${candidate.id}.`);
    }
  }, [addLog, toast, isCalling, updateCandidate, selectedCandidate]);

  const handleSelectCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setDetailModalOpen(true);
  };

  if (!isInitialized) {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      <div className="mx-auto max-w-screen-2xl">
        <AppHeader />
        <main className="mt-4 grid grid-cols-1 lg:grid-cols-3 lg:gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Card>
              <CardContent className="p-4">
                <QueryForm
                  initialQuery={query}
                  onSearch={handleSearch}
                  onClear={clearState}
                  isSearching={isSearching}
                />
              </CardContent>
            </Card>
            <Card className="flex-grow">
              <CardContent className="p-4">
                 <ResultsTable 
                  candidates={candidates}
                  onCall={handleCall}
                  onSelectRow={handleSelectCandidate}
                  isCalling={isCalling}
                  selectedCandidateId={selectedCandidate?.id}
                />
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col gap-6 mt-6 lg:mt-0">
            <LogPanel logs={logs.slice().reverse()} onClear={clearLogs} />
          </div>
        </main>

        <Dialog open={isDetailModalOpen} onOpenChange={setDetailModalOpen}>
            <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
                <DetailView 
                    candidate={selectedCandidate}
                    isCalling={selectedCandidate ? isCalling[selectedCandidate.id] : false} 
                />
            </DialogContent>
        </Dialog>

        <footer className="text-center mt-8 text-sm text-muted-foreground">
          CallCast AI PoC — For demonstration purposes only.
        </footer>
      </div>
    </div>
  );
}
