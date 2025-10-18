import os
from supabase import create_client, Client
from functools import lru_cache
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


@lru_cache()
def get_supabase_client() -> Client:
    """
    Returns a singleton Supabase client instance.

    Uses environment variables:
    - SUPABASE_URL: Your Supabase project URL
    - SUPABASE_KEY: Your Supabase anon/public key

    Returns:
        Client: Configured Supabase client

    Raises:
        ValueError: If required environment variables are not set
    """
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_KEY")

    if not supabase_url or not supabase_key:
        raise ValueError(
            "Missing Supabase credentials. Please set SUPABASE_URL and SUPABASE_KEY "
            "environment variables."
        )

    return create_client(supabase_url, supabase_key)
