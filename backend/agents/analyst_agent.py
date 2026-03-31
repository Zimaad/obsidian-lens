import json
from state import ResearchState
from utils.llm import get_llm

def analyst_agent(state: ResearchState) -> ResearchState:
    print("[Analyst Agent] Detecting high-fidelity contradictions...")
    llm = get_llm(temperature=0.2)

    claims_summary = "\n".join([
        f"- [{c['year']}] {c['paper_title']}: {[cl['claim'] for cl in c['claims']]}"
        for c in state["claims"]
    ])

    prompt = f"""You are a deep-learning research analyst. Analyze the following claims across various papers and identify significant contradictions, scientific disagreements, or empirical tensions.

Consider:
- Differing results on the same benchmark
- Opposing theoretical claims
- Divergent predictions for future scaling 

Claims for Context:
{claims_summary}

Your task is to synthesize these into "Contradiction Pairs".
Return ONLY a JSON array. 
Format: [
  {{
    "a": "Detailed scientific claim from Paper X",
    "b": "Opposing scientific claim from Paper Y",
    "analysis": "Sophisticated technical analysis of why these two claims conflict (e.g., hidden variables, differing hyper-parameters, or fundamental theoretical divergence).",
    "trend": "How this contradiction has evolved in the literature (if discernible).",
    "severity": "critical|high|medium"
  }}
]"""

    try:
        response = llm.invoke(prompt)
        raw = response.content.strip()
        # Handle cases where LLM includes extra text
        if "```json" in raw:
            raw = raw.split("```json")[1].split("```")[0].strip()
        elif "```" in raw:
            raw = raw.split("```")[1].split("```")[0].strip()

        contradictions = json.loads(raw)
        print(f"[Analyst Agent] Identified {len(contradictions)} high-detail tensions")
        return {**state, "contradictions": contradictions}
    except Exception as e:
        print(f"[Analyst Agent] Failed: {e}")
        return {**state, "contradictions": [], "error": str(e)}