import time
import requests
from state import ResearchState

SEMANTIC_SCHOLAR_URL = "https://api.semanticscholar.org/graph/v1/paper/search"

MAX_RETRIES = 3
RETRY_DELAY = 2  # seconds (doubles on each retry)

def search_agent(state: ResearchState) -> ResearchState:
    print(f"[Search Agent] Searching for: {state['topic']}")

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            response = requests.get(SEMANTIC_SCHOLAR_URL, params={
                "query": state["topic"],
                "limit": 15,
                "fields": "title,abstract,year,authors,externalIds"
            }, timeout=30)

            # Handle rate limiting (429)
            if response.status_code == 429:
                wait = RETRY_DELAY * (2 ** (attempt - 1))
                print(f"[Search Agent] Rate limited (429). Retrying in {wait}s... (attempt {attempt}/{MAX_RETRIES})")
                time.sleep(wait)
                continue

            # Handle other HTTP errors
            if response.status_code != 200:
                print(f"[Search Agent] HTTP {response.status_code}: {response.text[:200]}")
                wait = RETRY_DELAY * (2 ** (attempt - 1))
                time.sleep(wait)
                continue

            data = response.json()
            papers = data.get("data", [])

            # Filter out papers with no abstract
            papers = [p for p in papers if p.get("abstract")]
            print(f"[Search Agent] Found {len(papers)} papers with abstracts")
            return {**state, "papers": papers}

        except requests.exceptions.Timeout:
            print(f"[Search Agent] Request timed out (attempt {attempt}/{MAX_RETRIES})")
            if attempt < MAX_RETRIES:
                time.sleep(RETRY_DELAY)
                continue
        except Exception as e:
            print(f"[Search Agent] Error: {e} (attempt {attempt}/{MAX_RETRIES})")
            if attempt < MAX_RETRIES:
                time.sleep(RETRY_DELAY)
                continue

    # All retries exhausted — try the bulk search endpoint as fallback
    print("[Search Agent] Primary search failed. Trying bulk search endpoint...")
    try:
        bulk_url = "https://api.semanticscholar.org/graph/v1/paper/search/bulk"
        response = requests.get(bulk_url, params={
            "query": state["topic"],
            "limit": 15,
            "fields": "title,abstract,year,authors,externalIds"
        }, timeout=30)

        if response.status_code == 200:
            data = response.json()
            papers = data.get("data", [])
            papers = [p for p in papers if p.get("abstract")]
            print(f"[Search Agent] Bulk endpoint found {len(papers)} papers")
            return {**state, "papers": papers}
        else:
            print(f"[Search Agent] Bulk endpoint also failed: HTTP {response.status_code}")
    except Exception as e:
        print(f"[Search Agent] Bulk endpoint error: {e}")

    return {**state, "papers": [], "error": "Search failed after all retries (API rate-limited or unavailable)"}