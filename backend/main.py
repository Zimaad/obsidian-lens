from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from graph.pipeline import build_pipeline
from utils.llm import get_llm

app = FastAPI(title="Research Gap Finder")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

pipeline = build_pipeline()

class TopicRequest(BaseModel):
    topic: str

class ChatRequest(BaseModel):
    message: str
    topic: str
    context: str = ""

@app.get("/")
def root():
    return {"status": "Research Gap Finder API is running"}

@app.post("/analyze")
def analyze(req: TopicRequest):
    result = pipeline.invoke({
        "topic": req.topic,
        "papers": [],
        "claims": [],
        "contradictions": [],
        "gaps": [],
        "error": ""
    })
    return {
        "topic": result["topic"],
        "papers_found": len(result["papers"]),
        "papers": [{"title": p.get("title"), "year": p.get("year")} for p in result["papers"]],
        "claims": result["claims"],
        "contradictions": result["contradictions"],
        "gaps": result["gaps"],
        "error": result.get("error", "")
    }

@app.post("/chat")
def chat(req: ChatRequest):
    llm = get_llm(temperature=0.7)
    
    prompt = f"""You are a senior research analyst discussing this topic: {req.topic}.
Relevant Context (Discovered Gaps): {req.context}

User question: {req.message}

Respond intelligently as a professional researcher. Keep it insightful but concise.
If the user asks for more detail on a gap, explain the technical intuition behind it."""

    try:
        response = llm.invoke(prompt)
        return {"response": response.content.strip()}
    except Exception as e:
        return {"response": f"I had trouble connecting to the neural interface: {str(e)}", "error": str(e)}