import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('missing supabase env vars');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// extract search keywords from description
function extractSearchTerms(text: string): string[] {
  const stopWords = new Set([
    'a','an','the','is','are','was','were','be','been','being','have','has','had',
    'do','does','did','will','would','could','should','may','might','shall','can',
    'need','dare','ought','used','to','of','in','for','on','with','at','by','from',
    'as','into','through','during','before','after','above','below','between','out',
    'off','over','under','again','further','then','once','here','there','when',
    'where','why','how','all','each','every','both','few','more','most','other',
    'some','such','no','nor','not','only','own','same','so','than','too','very',
    'just','because','but','and','or','if','while','although','though','until',
    'unless','since','what','which','who','whom','this','that','these','those',
    'i','me','my','myself','we','our','ours','you','your','yours','he','him','his',
    'she','her','hers','it','its','they','them','their','get','give','want','like',
    'look','find','recommendation','recommend','suggest','suggestion','please',
    'help','looking','something','anything','within','budget','price','cost',
    'about','around','approximately','new','good','best','cheap','expensive',
  ]);

  const words = text.toLowerCase()
    .replace(/[^a-zA-Z\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w));

  return [...new Set(words)];
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { description, budget, category } = body;

    console.log('received request:', { description, budget, category });

    if (!description && !category) {
      console.log('validation failed: missing description and category');
      return NextResponse.json(
        { error: 'Description or category is required' },
        { status: 400 }
      );
    }

    // extract search keywords
    const searchTerms = extractSearchTerms(description || '');
    console.log('extracted search terms:', searchTerms);

    // query supabase for matching products
    console.log('querying supabase...');
    let query = supabase.from('grainger_products').select('*');

    // build OR conditions for label + product columns
    const orConditions: string[] = [];

    if (category) {
      orConditions.push(`label.ilike.%${category}%`);
      orConditions.push(`product.ilike.%${category}%`);
    }

    for (const term of searchTerms) {
      orConditions.push(`label.ilike.%${term}%`);
      orConditions.push(`product.ilike.%${term}%`);
    }

    if (orConditions.length > 0) {
      query = query.or(orConditions.join(','));
    }

    if (budget) {
      query = query.lte('price', budget);
    }

    const { data: products, error: dbError } = await query
      .order('price', { ascending: true })
      .limit(30);

    if (dbError) {
      console.error('supabase query error:', dbError);
      return NextResponse.json(
        { error: 'Database query failed', details: dbError.message },
        { status: 500 }
      );
    }

    console.log(`found ${products?.length || 0} products in db`);

    if (!products || products.length === 0) {
      console.log('no products found matching criteria');
      return NextResponse.json({
        aiText: 'No products found matching your criteria. Try adjusting your budget or category.',
        products: [],
      });
    }

    // use gemini to select best products
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      console.error('GOOGLE_API_KEY not configured');
      return NextResponse.json(
        { error: 'GOOGLE_API_KEY not configured' },
        { status: 500 }
      );
    }

    // build gemini prompt
    const productList = (products || [])
      .map((p, idx) => `${idx}. [ID: ${p.id}] ${p.product} | $${p.price} | Category: ${p.label}`)
      .join('\n');

    const prompt = `You are a procurement assistant for industrial/construction projects.

Project Description: ${description || 'General project'}
Budget: $${budget || 'Not specified'}
Category: ${category || 'General'}

Available products from our catalog:
${productList}

TASK: Select up to 6 MOST RELEVANT products for this project from the list above. Consider the project description, budget, and required functionality. Match the user's request as closely as possible - if they ask for a specific product type (e.g. "sink", "drill", "toilet"), prioritize products of that type.

RESPOND ONLY WITH VALID JSON in this exact format (no markdown, no backticks, no preamble):
{
  "recommendations": [
    {
      "id": "product_id_here",
      "reasoning": "Brief explanation why this product fits the project"
    }
  ],
  "summary": "Brief 1-2 sentence overview of your recommendations"
}

CRITICAL: Return ONLY the JSON object, nothing else.`;

    let selectedProducts = [];
    let aiSummary = 'AI recommendations based on your project criteria.';

    try {
      console.log('calling gemini api...');
      
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 2000,
            }
          }),
        }
      );

      if (!geminiRes.ok) {
        const errorText = await geminiRes.text();
        console.error('gemini api http error:', geminiRes.status, errorText);
        throw new Error(`Gemini API returned ${geminiRes.status}`);
      }

      const geminiData = await geminiRes.json();
      console.log('gemini response received');

      if (geminiData.candidates?.[0]?.content?.parts?.[0]?.text) {
        const responseText = geminiData.candidates[0].content.parts[0].text;
        console.log('raw gemini response:', responseText.substring(0, 200) + '...');
        
        // strip markdown code blocks if present
        const cleanedResponse = responseText
          .replace(/```json\n?/g, '')
          .replace(/```\n?/g, '')
          .trim();

        const aiResponse = JSON.parse(cleanedResponse);
        console.log('parsed ai response:', aiResponse);
        
        // map recommendations back to actual products
        selectedProducts = aiResponse.recommendations
          .map((rec: { id: string | number; reasoning?: string }) => {
            const product = products?.find(p => String(p.id) === String(rec.id));
            if (product) {
              return {
                id: product.id,
                product: product.product,
                price: parseFloat(product.price) || 0,
                grainger_url: product.grainger_url || '#',
                image_url: product.image_url || '',
                label: product.label || '',
                reasoning: rec.reasoning || '',
              };
            }
            console.log(`product not found for id: ${rec.id}`);
            return null;
          })
          .filter((p: unknown) => p !== null)
          .slice(0, 6);

        aiSummary = aiResponse.summary || 'Selected products based on your project requirements.';
        console.log(`selected ${selectedProducts.length} products`);
        
      } else if (geminiData.error) {
        console.error('gemini api error:', geminiData.error);
        throw new Error(geminiData.error.message || 'Gemini API error');
      } else {
        console.error('unexpected gemini response:', geminiData);
        throw new Error('Unexpected Gemini response structure');
      }
    } catch (error) {
      console.error('gemini processing error:', error);
      
      // Fallback: return first 6 products
      selectedProducts = (products || []).slice(0, 6).map(p => ({
        id: p.id,
        product: p.product,
        price: parseFloat(p.price) || 0,
        grainger_url: p.grainger_url || '#',
        image_url: p.image_url || '',
        label: p.label || '',
        reasoning: '',
      }));
      
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      aiSummary = `AI temporarily unavailable (${errorMsg}). Showing top matching products.`;
      console.log(`using fallback: ${selectedProducts.length} products`);
    }

    console.log(`returning ${selectedProducts.length} products to client`);

    return NextResponse.json({
      aiText: aiSummary,
      products: selectedProducts,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('ai route error:', err);
    return NextResponse.json(
      { error: 'AI processing failed', details: message },
      { status: 500 }
    );
  }
}