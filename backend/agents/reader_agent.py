import json
from langchain_groq import ChatGroq
from state import ResearchState
from dotenv import load_dotenv

load_dotenv()

llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0.1)

def reader_agent(state: ResearchState) -> ResearchState:
    print(f"[Reader Agent] Extracting claims from {len(state['papers'])} papers...")
    all_claims = []

    # Limit to top 5 papers to avoid LLM rate limits and long latency
    for paper in state["papers"][:5]:
        title = paper.get("title", "Unknown")
        abstract = paper.get("abstract", "")
        year = paper.get("year", "N/A")

        prompt = f"""You are a research analyst. Extract the 2-3 most important claims from this paper abstract.
Return ONLY a JSON array, no explanation, no markdown, no backticks.

Format: [{{"claim": "...", "type": "finding|method|hypothesis"}}]

Title: {title}
Year: {year}
Abstract: {abstract}"""

        try:
            response = llm.invoke(prompt)
            raw = response.content.strip()
            claims = json.loads(raw)
            all_claims.append({
                "paper_title": title,
                "year": year,
                "claims": claims
            })
        except Exception as e:
            print(f"[Reader Agent] Failed on '{title}': {e}")
            continue

    print(f"[Reader Agent] Extracted claims from {len(all_claims)} papers")
    return {**state, "claims": all_claims}