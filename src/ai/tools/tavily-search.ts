/**
 * Tavily API integration for real-time web search
 */

export interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
  raw_content?: string;
}

export interface TavilySearchResponse {
  results: TavilySearchResult[];
  query: string;
}

/**
 * Search the web using Tavily API
 */
export async function searchWeb(query: string, maxResults: number = 5): Promise<TavilySearchResult[]> {
  const apiKey = process.env.TAVILY_API_KEY;
  
  if (!apiKey) {
    console.error('[Tavily] API key not configured');
    throw new Error('TAVILY_API_KEY is not configured in .env file');
  }

  try {
    console.log(`[Tavily] Searching for: "${query}"`);
    
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: apiKey,
        query: query,
        search_depth: 'advanced',
        include_raw_content: false,
        max_results: maxResults,
        include_domains: [],
        exclude_domains: [],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Tavily] API error: ${response.status} - ${errorText}`);
      throw new Error(`Tavily API error: ${response.status}`);
    }

    const data: TavilySearchResponse = await response.json();
    console.log(`[Tavily] Found ${data.results.length} results for "${query}"`);
    
    return data.results;
  } catch (error) {
    console.error('[Tavily] Search failed:', error);
    throw error;
  }
}

/**
 * Extract phone numbers from text using regex patterns
 */
export function extractPhoneNumbers(text: string): string[] {
  const phonePatterns = [
    // Indian phone numbers with various formats
    /(?:\+91[-\s]?)?[6-9]\d{9}\b/g,
    /(?:91[-\s]?)?[6-9]\d{9}\b/g,
    /\b[6-9]\d{2}[-\s]?\d{3}[-\s]?\d{4}\b/g,
    // US/International phone numbers
    /(?:\+1[-\s]?)?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}\b/g,
    // Generic international with country code
    /\+\d{1,3}[-\s]?\d{3,4}[-\s]?\d{3,4}[-\s]?\d{3,4}\b/g,
    // Phone numbers with dots: 987.654.3210
    /\b\d{3}\.\d{3}\.\d{4}\b/g,
  ];

  const phoneNumbers = new Set<string>();
  
  for (const pattern of phonePatterns) {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => {
        // Clean up the phone number but keep original format
        const cleaned = match.replace(/[-\s().]/g, '');
        // Only add if it's a valid length (10-15 digits)
        if (cleaned.length >= 10 && cleaned.length <= 15) {
          // Store the original formatted version
          phoneNumbers.add(match.trim());
        }
      });
    }
  }

  return Array.from(phoneNumbers);
}

/**
 * Extract dealer/agent name from text
 */
export function extractDealerName(text: string, title: string): string {
  // Common patterns for dealer names
  const patterns = [
    /(?:contact|call|reach)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
    /([A-Z][a-z]+\s+(?:Properties|Realty|Estates|Developers|Builders|Real\s+Estate))/i,
    /(?:by|from)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
    /([A-Z][a-z]+\s+[A-Z][a-z]+)\s+(?:at|on)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  // Fallback: extract from title or use domain
  const titleMatch = title.match(/([A-Z][a-z]+\s+(?:Properties|Realty|Estates))/i);
  if (titleMatch) {
    return titleMatch[1];
  }

  return 'Property Dealer';
}

/**
 * Extract address/location from text
 */
export function extractAddress(text: string, query: string): string | null {
  // Try to find location mentioned in the text
  const locationPatterns = [
    /(?:in|at|near|located)\s+([A-Z][a-z]+(?:,?\s+[A-Z][a-z]+)*)/,
    /([A-Z][a-z]+,\s*[A-Z][a-z]+)/,
  ];

  for (const pattern of locationPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  // Fallback: extract from query
  const queryMatch = query.match(/(?:in|at|near)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
  if (queryMatch) {
    return queryMatch[1];
  }

  return null;
}
