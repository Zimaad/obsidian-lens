from langgraph.graph import StateGraph, END
from state import ResearchState
from agents.search_agent import search_agent
from agents.reader_agent import reader_agent
from agents.analyst_agent import analyst_agent
from agents.gap_synthesizer import gap_synthesizer

def should_continue(state: ResearchState) -> str:
    papers = state.get("papers", [])
    if state.get("error"):
        print(f"[Pipeline] Ending: Error in state: {state['error']}")
        return "end"
    if not papers:
        print("[Pipeline] Ending: No papers found")
        return "end"
    print(f"[Pipeline] Continuing to Reader with {len(papers)} papers")
    return "reader"

def build_pipeline():
    graph = StateGraph(ResearchState)

    graph.add_node("search",      search_agent)
    graph.add_node("reader",      reader_agent)
    graph.add_node("analyst",     analyst_agent)
    graph.add_node("synthesizer", gap_synthesizer)

    graph.set_entry_point("search")

    # Conditional edge after search — retry or continue
    graph.add_conditional_edges("search", should_continue, {
        "reader": "reader",
        "end": END
    })

    graph.add_edge("reader",      "analyst")
    graph.add_edge("analyst",     "synthesizer")
    graph.add_edge("synthesizer", END)

    return graph.compile()