from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from graph.pipeline import build_pipeline

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