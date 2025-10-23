
'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating structured real estate subqueries from a free-text query.
 *
 * - generateRealEstateSubqueries - A function that takes a free-text query and returns an array of structured subqueries.
 * - GenerateRealEstateSubqueriesInput - The input type for the generateRealEstateSubqueries function.
 * - GenerateRealEstateSubqueriesOutput - The output type for the generateRealEstateSubqueries function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRealEstateSubqueriesInputSchema = z.object({
  query: z.string().describe('A free-text real estate query.'),
});
export type GenerateRealEstateSubqueriesInput = z.infer<typeof GenerateRealEstateSubqueriesInputSchema>;

const GenerateRealEstateSubqueriesOutputSchema = z.array(
  z.object({
    id: z.number().describe('Unique identifier for the subquery.'),
    query_text: z.string().describe('The structured query text for web search.'),
    location: z.string().nullable().describe('The location for the property, if specified.'),
    property_type: z.string().nullable().describe('The type of property (house, apartment, etc.), if specified.'),
    price_range: z.string().nullable().describe('The price range for the property, if specified.'),
    date_range: z.string().nullable().describe('The date range for the listing, if specified (e.g., "last 30 days").'),
    filters: z.string().nullable().describe('Additional filters to apply to the search.'),
    priority: z.number().describe('The priority of the subquery (1-5, 1 being highest).'),
    note: z.string().nullable().describe('Any additional notes or context for the subquery.'),
  })
);
export type GenerateRealEstateSubqueriesOutput = z.infer<typeof GenerateRealEstateSubqueriesOutputSchema>;

export async function generateRealEstateSubqueries(
  input: GenerateRealEstateSubqueriesInput
): Promise<GenerateRealEstateSubqueriesOutput> {
  return generateRealEstateSubqueriesFlow(input);
}

const systemPrompt = `You are an assistant that converts a single free-text real-estate query into multiple structured web-search subqueries optimized for finding property dealers and their contact information. For each subquery, generate a JSON object with the following fields: id, query_text, location, property_type, price_range, date_range, filters, priority, note. Produce 3-8 focused subqueries covering likely variants.

IMPORTANT: Each query_text should include keywords like "dealer", "agent", "contact", "phone", "broker", or "real estate" to maximize finding contact information.

If no date range is specified in the query, infer a relevant date_range, such as 'last 30 days', to find recent listings.

Your entire response MUST be a single, valid JSON array of subquery objects.

Example:
User Query: 3 BHK Kothrud under 1.5Cr contact dealer

Your response:
[{
  "id": 1,
  "query_text": "3 BHK Kothrud dealer contact phone number",
  "location": "Kothrud, Pune",
  "property_type": "house",
  "price_range": "₹1.0Cr-1.5Cr",
  "date_range": "last 30 days",
  "filters": null,
  "priority": 1,
  "note": "Exact match with contact info, recent listings"
},
{
  "id": 2,
  "query_text": "3 BHK apartment real estate agent Pune phone",
  "location": "Pune",
  "property_type": "apartment",
  "price_range": "₹50L-1.5Cr",
  "date_range": "last 90 days",
  "filters": null,
  "priority": 2,
  "note": "Wider city search with agent contact"
},
{
  "id": 3,
  "query_text": "Kothrud property dealer 3 BHK contact number",
  "location": "Kothrud",
  "property_type": "resale",
  "price_range": null,
  "date_range": "last 7 days",
  "filters": null,
  "priority": 3,
  "note": "Recent listings with dealer contact"
},
{
  "id": 4,
  "query_text": "3 BHK Kothrud broker phone number under 1.5 crore",
  "location": "Kothrud",
  "property_type": "apartment",
  "price_range": "₹1.0Cr-1.5Cr",
  "date_range": "last 60 days",
  "filters": null,
  "priority": 4,
  "note": "Broker contact with price range"
}]
`;

const generateRealEstateSubqueriesPrompt = ai.definePrompt({
  name: 'generateRealEstateSubqueriesPrompt',
  input: {schema: GenerateRealEstateSubqueriesInputSchema},
  output: {schema: GenerateRealEstateSubqueriesOutputSchema},
  prompt: systemPrompt + '\n\nUser Query: {{{query}}}',
});

const generateRealEstateSubqueriesFlow = ai.defineFlow(
  {
    name: 'generateRealEstateSubqueriesFlow',
    inputSchema: GenerateRealEstateSubqueriesInputSchema,
    outputSchema: GenerateRealEstateSubqueriesOutputSchema,
  },
  async input => {
    try {
      const response = await generateRealEstateSubqueriesPrompt(input);
      const output = response.output;
      if (!output) {
        throw new Error('Received no output from model for subquery generation.');
      }
      return output;
    } catch (e) {
      console.error("Error in generateRealEstateSubqueriesFlow:", e);
      throw e;
    }
  }
);
