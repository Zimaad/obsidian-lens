# 🌌 Hiatus: Neural Research Synthesis

**Hiatus** is a high-fidelity research intelligence engine designed to identify structural gaps and latent contradictions within academic literature. By leveraging **LangGraph** for orchestrated multi-agent reasoning and **Groq (Llama 3.3)** for lightning-fast inference, it transforms thousands of papers into actionable research frontiers.

---

## ✨ Features

- **🔬 Analysis Lab**: Initiate deep semantic cross-analysis. Watch real-time as agents search, read, and synthesize research landscapes.
- **📊 Intelligence Dashboard**: Track your research history and dynamic stats (Gaps Discovered, Papers Indexed).
- **💬 AI Research Analyst**: Discuss findings with a persistent AI assistant that has full context of discovered gaps.
- **🛡️ Multi-Key Rotation**: Built-in support for rotating Groq API keys to handle high-detail synthesis without rate limits.
- **🔒 Secure Workspace**: Personal account management via Firebase Auth and Firestore persistence.

---

## 🛠️ Technology Stack

- **Frontend**: [Next.js 15+](https://nextjs.org/) (App Router, Turbopack), [Tailwind CSS](https://tailwindcss.com/)
- **Backend**: [FastAPI](https://fastapi.tiangolo.com/), [LangGraph](https://www.langchain.com/langgraph), [LangChain](https://www.langchain.com/)
- **Inference**: [Groq](https://groq.com/) (Llama 3.3 70B)
- **Database/Auth**: [Firebase](https://firebase.google.com/) (Firestore, Auth)

---

## 🚀 Getting Started

### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```
Create a `.env` in `backend/`:
```env
GROQ_API_KEY=your_key_here
GROQ_API_KEY_2=optional_second_key_for_rotation
```
Run the server:
```bash
uvicorn main:app --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
```
Create a `.env.local` in `frontend/`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
...
```
Launch the app:
```bash
npm run dev
```

---

## 🧠 Core Pipeline Architecture

The **Obsidian Neural Core** follows a 4-stage pipeline:
1. **Search Agent**: Scans Open Research APIs for relevant paper clusters.
2. **Reader Agent**: Extracts granular technical claims and metrics.
3. **Analyst Agent**: Detects high-fidelity contradictions and theoretical tensions.
4. **Synthesizer Agent**: Formalizes structural gaps and suggests technical approaches.

---