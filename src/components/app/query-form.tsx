
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Search, Trash2 } from 'lucide-react';

interface QueryFormProps {
  initialQuery: string;
  onSearch: (query: string) => void;
  onClear: () => void;
  isSearching: boolean;
}

const exampleQueries = [
  '3 BHK Kothrud under 1.5Cr contact dealer',
  '2 BHK Baner under 80L contact agent',
  'Plot near Pune contact seller',
  'Commercial space for rent in Hinjewadi',
];

export function QueryForm({
  initialQuery,
  onSearch,
  onClear,
  isSearching,
}: QueryFormProps) {
  const [query, setQuery] = useState(initialQuery);
  const [selectedExample, setSelectedExample] = useState(initialQuery);

  const handleSearchClick = () => {
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleExampleChange = (value: string) => {
    setSelectedExample(value);
    setQuery(value);
  };
  
  const loading = isSearching;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          type="text"
          placeholder="e.g., 3 BHK Kothrud under 1.5Cr contact dealer"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}
          disabled={loading}
          className="flex-grow"
        />
        <Select onValueChange={handleExampleChange} defaultValue={initialQuery} disabled={loading}>
          <SelectTrigger className="w-full sm:w-[280px]">
            <SelectValue placeholder="Select an example" />
          </SelectTrigger>
          <SelectContent>
            {exampleQueries.map((ex, i) => (
              <SelectItem key={i} value={ex}>{ex}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2 justify-start">
        <Button onClick={handleSearchClick} disabled={loading || !query.trim()}>
          {isSearching ? <Loader2 className="animate-spin" /> : <Search />}
          <span>Search</span>
        </Button>
        <Button onClick={onClear} disabled={loading} variant="ghost">
          <Trash2 />
          <span>Clear</span>
        </Button>
      </div>
    </div>
  );
}
