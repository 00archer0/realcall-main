
'use server';
/**
 * @fileOverview This file defines a Genkit flow for searching for real estate candidates online.
 *
 * - searchForCandidates - A function that takes subqueries and returns a list of candidate objects.
 * - SearchForCandidatesInput - The input type for the searchForCandidates function.
 * - SearchForCandidatesOutput - The output type for the searchForCandidates function.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { searchWeb, extractPhoneNumbers, extractDealerName, extractAddress } from '@/ai/tools/tavily-search';

const CandidateSchema = z.object({
  subquery_id: z.number().describe('The ID of the subquery that produced this candidate.'),
  property_title: z.string().describe('The title of the property listing.'),
  address: z.string().nullable().describe('The address of the property.'),
  dealer_name: z.string().describe('The name of the real estate dealer or agency.'),
  phone_numbers: z.array(z.string()).describe('A list of phone numbers for the dealer.'),
  source_url: z.string().url().describe('The URL of the source web page.'),
  last_seen: z.string().nullable().describe('The date the listing was last seen or updated.'),
  snippet: z.string().nullable().describe('A brief snippet from the search result.'),
  confidence: z.number().min(0).max(1).describe('The confidence score (0-1) that this is a valid candidate.'),
  status: z.enum(['New', 'Calling', 'Interested', 'No Answer', 'Error', 'Completed']).default('New'),
  last_call_summary: z.string().nullable(),
  call_transcript: z.string().nullable(),
  recording_url: z.string().nullable(),
});

const SearchForCandidatesInputSchema = z.object({
  subqueries: z.array(
    z.object({
      id: z.number(),
      query_text: z.string(),
      location: z.string().nullable(),
      property_type: z.string().nullable(),
      price_range: z.string().nullable(),
      date_range: z.string().nullable(),
      filters: z.string().nullable(),
      priority: z.number(),
      note: z.string().nullable(),
    })
  ),
});
export type SearchForCandidatesInput = z.infer<typeof SearchForCandidatesInputSchema>;

const SearchForCandidatesOutputSchema = z.array(CandidateSchema);
export type SearchForCandidatesOutput = z.infer<typeof SearchForCandidatesOutputSchema>;

export async function searchForCandidates(
  input: SearchForCandidatesInput
): Promise<SearchForCandidatesOutput> {
  return searchForCandidatesFlow(input);
}


const searchForCandidatesFlow = ai.defineFlow(
  {
    name: 'searchForCandidatesFlow',
    inputSchema: SearchForCandidatesInputSchema,
    outputSchema: SearchForCandidatesOutputSchema,
  },
  async (input) => {
    const startTime = Date.now();
    console.log('[Flow] Using REAL web search via Tavily API. Searching for property listings...');
    
    const allCandidates: SearchForCandidatesOutput = [];
    const seenUrls = new Set<string>();
    
    // Search for each subquery
    for (const subquery of input.subqueries) {
      try {
        console.log(`[Flow] Searching subquery #${subquery.id}: "${subquery.query_text}"`);
        
        // Perform web search using Tavily
        const searchResults = await searchWeb(subquery.query_text, 5);
        
        // Process each search result
        for (const result of searchResults) {
          // Skip duplicates
          if (seenUrls.has(result.url)) {
            console.log(`[Flow] Skipping duplicate URL: ${result.url}`);
            continue;
          }
          seenUrls.add(result.url);
          
          // Extract information from the search result
          const fullText = `${result.title} ${result.content}`;
          const phoneNumbers = extractPhoneNumbers(fullText);
          
          const dealerName = extractDealerName(fullText, result.title);
          const address = extractAddress(fullText, subquery.query_text) || subquery.location;
          
          // Calculate confidence based on relevance score and phone number presence
          let confidence = result.score;
          if (phoneNumbers.length > 0) {
            confidence = Math.min(result.score * 0.7 + 0.3, 1); // Boost confidence if phone found
          } else {
            confidence = Math.min(result.score * 0.5, 0.6); // Lower confidence if no phone
            console.log(`[Flow] Warning: No phone numbers found for: ${result.title}`);
          }
          
          const candidate = {
            subquery_id: subquery.id,
            property_title: result.title,
            address: address,
            dealer_name: dealerName,
            phone_numbers: phoneNumbers.length > 0 ? phoneNumbers : ['No phone number found'],
            source_url: result.url,
            last_seen: new Date().toISOString(),
            snippet: result.content.substring(0, 200) + '...',
            confidence: confidence,
            status: 'New' as const,
            last_call_summary: null,
            call_transcript: null,
            recording_url: null,
          };
          
          allCandidates.push(candidate);
          console.log(`[Flow] Added candidate: ${candidate.property_title} (${phoneNumbers.length} phone numbers found)`);
        }
        
      } catch (error) {
        console.error(`[Flow] Error searching subquery #${subquery.id}:`, error);
        // Continue with other subqueries even if one fails
      }
    }
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`[Flow] Search complete. Found ${allCandidates.length} total candidates in ${duration}s.`);
    
    // Sort by confidence score (highest first)
    allCandidates.sort((a, b) => b.confidence - a.confidence);
    
    return allCandidates;
  }
);
