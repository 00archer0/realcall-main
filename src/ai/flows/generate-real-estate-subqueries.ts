'use server';
/**
 * @fileOverview Generates structured real estate subqueries from a free-text query using Groq.
 */

import { chatCompletion } from '@/ai/groq';
import { z } from 'zod';

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
  try {
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
}]`;

    const response = await chatCompletion(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `User Query: ${input.query}` },
      ],
      { response_format: { type: 'json_object' } }
    );

    // Parse the response - it might be wrapped in an object or be an array directly
    let parsed;
    try {
      parsed = JSON.parse(response);
      // If it's wrapped in an object, extract the array
      if (Array.isArray(parsed)) {
        // Already an array
      } else if (parsed.subqueries && Array.isArray(parsed.subqueries)) {
        parsed = parsed.subqueries;
      } else if (parsed.queries && Array.isArray(parsed.queries)) {
        parsed = parsed.queries;
      } else {
        // Try to find the first array value
        const firstArrayValue = Object.values(parsed).find(v => Array.isArray(v));
        if (firstArrayValue) {
          parsed = firstArrayValue;
        }
      }
    } catch (e) {
      console.error('Failed to parse JSON response:', response);
      throw new Error('Invalid JSON response from model');
    }

    return GenerateRealEstateSubqueriesOutputSchema.parse(parsed);
  } catch (e) {
    console.error('Error in generateRealEstateSubqueries:', e);
    throw e;
  }
}
