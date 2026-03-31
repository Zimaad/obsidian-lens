from typing import TypedDict, List

class ResearchState(TypedDict):
    topic: str
    papers: List[dict]
    claims: List[dict]
    contradictions: List[dict]
    gaps: List[dict]
    error: str