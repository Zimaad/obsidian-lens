import json
from langchain_groq import ChatGroq
from state import ResearchState
from dotenv import load_dotenv
from utils.llm import get_llm

load_dotenv()

def reader_agent(state: ResearchState) -> ResearchState:
    print(f"[Reader Agent] Extracting deep claims from papers...")
    llm = get_llm(temperature=0.1)
    all_claims = []

    # Limit to top 5 papers to avoid LLM rate limits and long latency
    for paper in state["papers"][:8]:
        title = paper.get("title", "Unknown")
        abstract = paper.get("abstract", "")
        year = paper.get("year", "N/A")

        prompt = f"""You are a research analyst. Extract the 5 most important and granular claims (findings, metrics, or limitations) from this paper.
Focus on:
- Quantitative metrics mentioned
- Specific architectural choices
- Fundamental theoretical boundaries

Return ONLY a JSON array.
Format: [{{"claim": "detailed technical claim", "type": "finding|method|limitation|hypothesis"}}]

Title: {title}
Year: {year}
Abstract: {abstract}"""

        try:
            response = llm.invoke(prompt)
            raw = response.content.strip()
            # Handle cases where LLM includes extra text
            if "```json" in raw:
                raw = raw.split("```json")[1].split("```")[0].strip()
            elif "```" in raw:
                raw = raw.split("```")[1].split("```")[0].strip()
                
            claims = json.loads(raw)
            all_claims.append({
                "paper_title": title,
                "year": year,
                "claims": claims
            })
        except Exception as e:
            print(f"[Reader Agent] Failed on '{title}': {e}")
            continue

    print(f"[Reader Agent] Extracted deep claims from {len(all_claims)} papers")
    return {**state, "claims": all_claims}