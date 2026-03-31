import json
from langchain_groq import ChatGroq
from state import ResearchState
from dotenv import load_dotenv

load_dotenv()

llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0.2)

def analyst_agent(state: ResearchState) -> ResearchState:
    print("[Analyst Agent] Detecting contradictions...")

    claims_summary = "\n".join([
        f"- [{c['year']}] {c['paper_title']}: {[cl['claim'] for cl in c['claims']]}"
        for c in state["claims"]
    ])

    prompt = f"""You are a critical research analyst. Analyze these claims from different papers and identify contradictions, disagreements, or tensions between them.

Claims:
{claims_summary}

Return ONLY a JSON array, no explanation, no markdown, no backticks.
Format: [
  {{
    "paper_a": "title of first paper",
    "paper_b": "title of second paper",
    "contradiction": "clear description of what they disagree on",
    "severity": "high|medium|low"
  }}
]

If no contradictions exist, return an empty array: []"""

    try:
        response = llm.invoke(prompt)
        raw = response.content.strip()
        contradictions = json.loads(raw)
        print(f"[Analyst Agent] Found {len(contradictions)} contradictions")
        return {**state, "contradictions": contradictions}
    except Exception as e:
        print(f"[Analyst Agent] Failed: {e}")
        return {**state, "contradictions": [], "error": str(e)}