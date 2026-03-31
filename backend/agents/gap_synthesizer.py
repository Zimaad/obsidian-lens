import json
from state import ResearchState
from utils.llm import get_llm

def gap_synthesizer(state: ResearchState) -> ResearchState:
    print("[Gap Synthesizer] Identifying research gaps with deep synthesis...")
    llm = get_llm(temperature=0.3)

    paper_titles = [p.get("title") for p in state["papers"]]
    claims_summary = "\n".join([
        f"- {c['paper_title']}: {[cl['claim'] for cl in c['claims']]}"
        for c in state["claims"]
    ])
    contradictions_summary = "\n".join([
        f"- {c['a']} vs {c['b']}: {c['analysis']}"
        for c in state["contradictions"]
    ]) if state.get("contradictions") else "None detected"

    prompt = f"""You are a senior research strategist specializing in '{state['topic']}'. 
Based on the research landscape below, identify 4-5 high-impact, specific research gaps.

Topic: {state['topic']}

Research Context:
Papers surveyed:
{chr(10).join(f'- {t}' for t in paper_titles)}

Core Claims:
{claims_summary}

Detected Contradictions and Tensions:
{contradictions_summary}

Rules for Gap Identification:
1. Structural Gap: A scenario where current architectures or methodologies logically stop working.
2. Contradictory Gap: Where two established bodies of work suggest opposing outcomes, but no cross-experimental validation exists.
3. Intersection Gap: A novel synthesis of two disconnected sub-fields found in the literature.

Return ONLY a JSON array. Each gap should be extremely detailed.
Format: [
  {{
    "title": "Short, catchy headline of the gap",
    "description": "Very detailed 2-3 sentence technical description of the gap.",
    "type": "structural|contradictory|intersection",
    "why_it_matters": "The specific downstream scientific or technological impact of filling this gap.",
    "suggested_approach": "A concrete technical path forward (mention specific methods or models).",
    "confidence": "high|medium|low"
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
            
        gaps = json.loads(raw)
        print(f"[Gap Synthesizer] Produced {len(gaps)} high-detail gaps")
        return {**state, "gaps": gaps}
    except Exception as e:
        print(f"[Gap Synthesizer] Failed: {e}")
        return {**state, "gaps": [], "error": str(e)}