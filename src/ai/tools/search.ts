
'use server';
/**
 * @fileoverview Defines Genkit tools for performing web searches and scraping web pages using the Tavily API.
 *
 * - webSearchTool - A tool for conducting a web search with a given query.
 * - scrapeWebPageTool - A tool for scraping the content of a given URL.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { mockRealEstateData } from './mock-data';

const TAVILY_API_URL = 'https://api.tavily.com/search';

// Ensure the TAVILY_API_KEY is available in the environment
if (!process.env.TAVILY_API_KEY) {
  console.warn(
    'TAVILY_API_KEY environment variable not set. Search tools will not work.'
  );
}

async function mockTavilySearch(payload: any) {
  console.log('[Tool] Using MOCK Tavily API with payload:', payload);

  // Mocking scrape operation
  if (payload.include_raw_content && payload.query.startsWith('url:')) {
    const url = payload.query.substring(4);
    if (mockRealEstateData[url]) {
      return {
        results: [{
          raw_content: mockRealEstateData[url].content
        }]
      };
    }
    return { results: [{ raw_content: `Content for ${url} not found in mock data.` }] };
  }

  // Mocking search operation
  const results = Object.keys(mockRealEstateData).map(url => ({
    url: url,
    content: mockRealEstateData[url].content, // Using full content as snippet for mock
    title: mockRealEstateData[url].title,
    score: Math.random() * (0.99 - 0.90) + 0.90 // random score between 0.90 and 0.99
  }));

  return { results: results };
}


async function tavilySearch(payload: object) {
  // Switch to mock search
  return mockTavilySearch(payload);

  if (!process.env.TAVILY_API_KEY) {
    const errorMsg = '[Tool Error] Tavily API key is not set.';
    console.error(errorMsg);
    return { error: errorMsg };
  }

  console.log('[Tool] Preparing to make Tavily API call with payload:', payload);

  try {
    const response = await fetch(TAVILY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...payload,
        api_key: process.env.TAVILY_API_KEY,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      const errorMsg = `[Tool Error] Tavily API request failed with status ${response.status}: ${errorBody}`;
      console.error(errorMsg);
      return { error: `Failed to perform Tavily API request. Status: ${response.status}` };
    }

    const jsonResponse = await response.json();
    console.log('[Tool] Successfully received response from Tavily API.');
    return jsonResponse;
  } catch (error) {
    const errorMsg = `[Tool Error] An unexpected error occurred during the Tavily API call: ${error instanceof Error ? error.message : String(error)}`;
    console.error(errorMsg);
    return { error: 'Failed to perform web search due to a network or server error.' };
  }
}

export const webSearchTool = ai.defineTool(
  {
    name: 'webSearch',
    description: 'Performs a web search for the given query and returns a list of relevant results with snippets and URLs.',
    inputSchema: z.object({
      query: z.string().describe('The search query.'),
    }),
    outputSchema: z.any().describe('The search results from the Tavily API, including snippets and links.'),
  },
  async (input) => {
    console.log(`[Tool Start] Performing web search for: "${input.query}"`);
    const searchResult = await tavilySearch({
        query: input.query,
        search_depth: 'advanced',
    });
    if (searchResult && 'results' in searchResult && Array.isArray(searchResult.results)) {
        console.log(`[Tool Success] Web search returned ${searchResult.results.length} results for query: "${input.query}"`);
    } else {
        console.warn(`[Tool Warning] Web search for "${input.query}" returned no results or an error.`, searchResult);
    }
    console.log(`[Tool End] Web search for: "${input.query}"`);
    return searchResult;
  }
);

export const scrapeWebPageTool = ai.defineTool(
  {
    name: 'scrapeWebPage',
    description: 'Scrapes the content of a given URL and returns it as a string.',
    inputSchema: z.object({
      url: z.string().url().describe('The URL of the web page to scrape.'),
    }),
    outputSchema: z.string().describe('The text content of the web page.'),
  },
  async (input) => {
    console.log(`[Tool Start] Attempting to scrape web page: "${input.url}"`);
    const response = await tavilySearch({
      query: `url:${input.url}`,
      include_raw_content: true,
    });
    
    if (response && 'results' in response && Array.isArray(response.results) && response.results.length > 0) {
      const content = response.results[0]?.raw_content || '';
      if (content) {
          console.log(`[Tool Success] Successfully scraped content from: "${input.url}"`);
      } else {
          console.warn(`[Tool Warning] Scraping for "${input.url}" was successful but returned empty content.`);
      }
      console.log(`[Tool End] Scraping for: "${input.url}"`);
      return content;
    }

    const errorMessage = `Error: Failed to scrape content from the URL ${input.url}. The link might be broken, inaccessible, or the content could not be extracted.`;
    console.error(`[Tool Error] Scraping failed for URL "${input.url}":`, response?.error || 'No content found in response');
    console.log(`[Tool End] Scraping for: "${input.url}"`);
    return errorMessage;
  }
);
