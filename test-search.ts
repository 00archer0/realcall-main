/**
 * Quick test script to verify Tavily search is working
 * Run with: npx tsx test-search.ts
 */

import { searchWeb, extractPhoneNumbers, extractDealerName, extractAddress } from './src/ai/tools/tavily-search';

async function testSearch() {
  console.log('Testing Tavily search...\n');
  
  try {
    const query = '3 BHK Kothrud Pune dealer contact phone number';
    console.log(`Query: "${query}"\n`);
    
    const results = await searchWeb(query, 3);
    
    console.log(`Found ${results.length} results:\n`);
    
    results.forEach((result, index) => {
      console.log(`Result ${index + 1}:`);
      console.log(`  Title: ${result.title}`);
      console.log(`  URL: ${result.url}`);
      console.log(`  Score: ${result.score}`);
      
      const fullText = `${result.title} ${result.content}`;
      const phones = extractPhoneNumbers(fullText);
      const dealer = extractDealerName(fullText, result.title);
      const address = extractAddress(fullText, query);
      
      console.log(`  Dealer: ${dealer}`);
      console.log(`  Phone Numbers: ${phones.length > 0 ? phones.join(', ') : 'None found'}`);
      console.log(`  Address: ${address || 'Not found'}`);
      console.log(`  Snippet: ${result.content.substring(0, 150)}...`);
      console.log('');
    });
    
    console.log('✅ Search test completed successfully!');
  } catch (error) {
    console.error('❌ Search test failed:', error);
    process.exit(1);
  }
}

testSearch();
