import json
from langchain_groq import ChatGroq
from state import ResearchState
from dotenv import load_dotenv

load_dotenv()

llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0.3)

def gap_synthesizer(state: ResearchState) -> ResearchState:
    print("[Gap Synthesizer] Identifying research gaps...")

    paper_titles = [p.get("title") for p in state["papers"]]
    claims_summary = "\n".join([
        f"- {c['paper_title']}: {[cl['claim'] for cl in c['claims']]}"
        for c in state["claims"]
    ])
    contradictions_summary = "\n".join([
        f"- {c['paper_a']} vs {c['paper_b']}: {c['contradiction']}"
        for c in state["contradictions"]
    ]) or "None detected"

    prompt = f"""You are a senior research strategist. Based on the research landscape below, identify 4-5 specific, actionable research gaps.

Topic: {state['topic']}

Papers surveyed:
{chr(10).join(f'- {t}' for t in paper_titles)}

Key claims across papers:
{claims_summary}

Contradictions found:
{contradictions_summary}

A gap is one of:
1. Something no paper has studied yet but logically should
2. A contradiction no one has resolved experimentally
3. An intersection of two subfields no one has explored

Return ONLY a JSON array, no explanation, no markdown, no backticks.
Format: [
  {{
    "gap": "specific description of the gap",
    "type": "unexplored|unresolved_contradiction|intersection",
    "why_it_matters": "why filling this gap is important",
    "suggested_approach": "brief method to address this gap",
    "confidence": "high|medium|low"
  }}
]"""

    try:
        response = llm.invoke(prompt)
        raw = response.content.strip()
        gaps = json.loads(raw)
        print(f"[Gap Synthesizer] Found {len(gaps)} gaps")
        return {**state, "gaps": gaps}
    except Exception as e:
        print(f"[Gap Synthesizer] Failed: {e}")
        return {**state, "gaps": [], "error": str(e)}