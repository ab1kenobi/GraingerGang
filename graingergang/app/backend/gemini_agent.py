import os
from dotenv import load_dotenv
from google import genai
from google.genai import types
from supabase import create_client, Client

# 1. setup
# load .env vars
env_path = os.path.join(os.path.dirname(__file__), '..', '..', '.env.local')
load_dotenv(env_path)

api_key = os.getenv("GOOGLE_API_KEY")
supabase_url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
supabase_key = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

if not api_key:
    print("Error: GOOGLE_API_KEY missing.")
    exit(1)

# configure the client
gemini_client = genai.Client(api_key=api_key)
supabase: Client = create_client(supabase_url, supabase_key)

# 2. tool function for gemini
def search_grainger_products(category: str, max_price: float):
    """
    Searches Supabase for products matching category and price.
    """
    print(f"\n   [System] 🔍 Searching Supabase for '{category}' under ${max_price}...")
    
    try:
        # query the table
        response = supabase.table('grainger_products') \
            .select('*') \
            .ilike('Label', f"%{category}%") \
            .lte('Prices', max_price) \
            .limit(3) \
            .execute()
        
        products = response.data
        
        if not products:
            return "No products found within that budget."
            
        # format the results for gemini
        results = []
        for p in products:
            name = p.get('Product', 'Unknown Product')
            price = p.get('Prices', 'N/A')
            link = p.get('Grainger URL', '#')
            results.append(f"Product: {name} | Price: ${price} | Link: {link}")
            
        return "\n".join(results)

    except Exception as e:
        return f"Database Error: {str(e)}"

# 3. run example prompt
if __name__ == "__main__":
    user_query = "I want to renovate my bathroom and begin by getting a new faucet. What is a faucet within my budget of 200?"
    print(f"User: {user_query}")

    # tool configuration
    # were just using the simplified dict config for maximum compatibility
    tool_config = {
        "tools": [search_grainger_products],
        "automatic_function_calling": {"disable": False}
    }

    try:
        # call the actual model
        response = gemini_client.models.generate_content(
            model='gemini-2.5-flash', 
            contents=user_query,
            config=tool_config
        )
        print(f"AI: {response.text}")

    except Exception as e:
        print(f"\nAPI Error: {e}")