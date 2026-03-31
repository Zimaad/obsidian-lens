"use client";
import AppLayout from "../components/AppLayout";
import Link from "next/link";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { db } from "../lib/firebase";
import { doc, getDoc, getDocs, collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, updateDoc, arrayUnion } from "firebase/firestore";

function GapExplorerContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { user } = useAuth();
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Chat state
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Fetch Analysis
  useEffect(() => {
    async function fetchAnalysis() {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const docSnap = await getDoc(doc(db, "analyses", id));
        if (docSnap.exists()) {
          setAnalysis(docSnap.data());
        }
      } catch (err) {
        console.error("Error fetching analysis:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalysis();
  }, [id]);

  // Real-time Chat Subscription
  useEffect(() => {
    if (!id || !user) return;
    
    // Check for an existing chat document for this analysis
    const chatsRef = collection(db, "chats");
    const q = query(chatsRef, where("analysisId", "==", id), where("userId", "==", user.uid));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const chatData = snapshot.docs[0].data();
        setMessages(chatData.messages || []);
      }
    });

    return () => unsubscribe();
  }, [id, user]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !id || !user || sending) return;

    const userMessage = input.trim();
    setInput("");
    setSending(true);

    try {
      // 1. Save user message to Firestore
      const chatsRef = collection(db, "chats");
      const q = query(chatsRef, where("analysisId", "==", id), where("userId", "==", user.uid));
      const chatSnapshot = await getDocs(q);
      
      let chatId = "";
      const newMessage = { role: "user", content: userMessage, timestamp: new Date() };

      if (chatSnapshot.empty) {
        const newChatDoc = await addDoc(chatsRef, {
          analysisId: id,
          userId: user.uid,
          messages: [newMessage],
          updatedAt: serverTimestamp()
        });
        chatId = newChatDoc.id;
      } else {
        chatId = chatSnapshot.docs[0].id;
        await updateDoc(doc(db, "chats", chatId), {
          messages: arrayUnion(newMessage),
          updatedAt: serverTimestamp()
        });
      }

      // 2. Call AI Backend
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          topic: analysis?.topic || "Unknown research",
          message: userMessage,
          context: analysis ? JSON.stringify(analysis.gaps.slice(0,2)) : ""
        }),
      });
      
      const data = await res.json();
      
      // 3. Save AI response to Firestore
      const aiMessage = { role: "assistant", content: data.response, timestamp: new Date() };
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion(aiMessage),
        updatedAt: serverTimestamp()
      });

    } catch (err) {
      console.error("Chat error:", err);
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="p-10 text-white font-mono uppercase tracking-widest text-xs">Accessing Neural Store...</div>;

  if (!analysis && id) return <div className="p-10 text-white">Neural record not found or inaccessible.</div>;

  const displayData = analysis || {
    topic: "Neural-Symbolic Gaps (Hardcoded Demo)",
    gaps: [
      { gap: "Temporal Consistency in Large-Scale Latent Models", description: "Architectures fail to maintain logical coherence over 1M+ tokens." },
      { gap: "Cross-Modal Reasoning in Low-Resource Domains", description: "Zero-shot visual and linguistic reasoning in sparse datasets." }
    ],
    contradictions: [
      { a: "Sparse attention mechanisms are structurally intact.", b: "Sparsity leads to logic collapse.", analysis: "Threshold definition conflict." }
    ]
  };

  return (
    <AppLayout>
      <div className="p-8 max-w-[1600px] mx-auto page-enter h-[calc(100vh-80px)] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 shrink-0">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-primary mb-1">Synthesized Frontiers</p>
            <h1 className="text-3xl font-bold text-white tracking-tight">{displayData.topic}</h1>
            {id && <p className="text-[10px] text-on-surface-variant font-mono mt-1">ID: {id} · SECURE LINK ACTIVE</p>}
          </div>
          <div className="flex gap-2">
            <Link href="/lab" className="btn-ghost text-xs px-4 py-2.5 rounded">
              <span className="material-symbols-outlined text-sm">refresh</span> Re-Analyze
            </Link>
          </div>
        </div>

        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Gaps content */}
          <div className="lg:col-span-8 overflow-y-auto space-y-6 pr-4 custom-scrollbar">
            <section className="space-y-4">
              <p className="font-mono text-xs uppercase tracking-widest text-on-surface-variant">{displayData.gaps.length} Critical Gaps Identified</p>
              {displayData.gaps.map((gap: any, i: number) => (
                <div 
                  key={i} 
                  className="glass-card border border-white/[0.05] rounded-xl p-6 group hover:bg-white/[0.04] transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-mono text-[10px] text-primary">GAP {String(i+1).padStart(2, "0")}</span>
                    <span className="px-2 py-0.5 rounded bg-tertiary/10 border border-tertiary/20 text-tertiary font-mono text-[8px] uppercase">Validated</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 leading-tight">{gap.gap || gap.title}</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed mb-4">{gap.description || gap.desc || "No description provided for this structural gap."}</p>
                  
                  <div className="flex gap-4 border-t border-white/[0.04] pt-4 mt-2">
                    <button className="text-[10px] font-mono uppercase text-primary hover:text-white transition-colors">Expand Dataset</button>
                    <button className="text-[10px] font-mono uppercase text-primary hover:text-white transition-colors">Find Cited Gaps</button>
                  </div>
                </div>
              ))}
            </section>

            {/* Contradictions */}
            <section className="space-y-4 pt-4 border-t border-white/[0.05]">
              <p className="font-mono text-xs uppercase tracking-widest text-on-surface-variant">Latent Contradictions Detected</p>
              {displayData.contradictions?.map((c: any, i: number) => (
                <div key={i} className="glass-card border border-error/15 rounded-xl p-5 bg-error/5">
                  <span className="material-symbols-outlined text-error text-xl mb-3">crisis_alert</span>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-3 rounded bg-black/20 border-l-2 border-secondary/40 text-xs italic text-on-surface-variant">&ldquo;{c.a}&rdquo;</div>
                    <div className="p-3 rounded bg-black/20 border-l-2 border-error/40 text-xs italic text-on-surface-variant">&ldquo;{c.b}&rdquo;</div>
                  </div>
                  <p className="text-xs text-on-surface-variant">{c.analysis || "The conflict centers on diverging definitions of nodal entropy under long-horizon inference loads."}</p>
                </div>
              ))}
            </section>
          </div>

          {/* AI Chat Right Side panel */}
          <div className="lg:col-span-4 flex flex-col glass-card border border-white/[0.05] rounded-2xl overflow-hidden bg-[#0A0A0F]/50">
            <div className="p-5 border-b border-white/[0.05] flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>psychology</span>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">AI Research Analyst</h3>
                  <p className="text-[9px] text-secondary font-mono">Neural Interface Online</p>
                </div>
              </div>
              <div className="data-pulse" />
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-40">
                  <span className="material-symbols-outlined text-3xl mb-3">forum</span>
                  <p className="text-xs">Discuss these findings with the AI researcher to synthesize new directions.</p>
                </div>
              ) : (
                messages.map((m: any, i: number) => (
                  <div key={i} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
                    <div className={`max-w-[85%] p-3 rounded-xl text-xs leading-relaxed 
                      ${m.role === "user" 
                        ? "bg-primary/20 text-white border border-primary/20 rounded-tr-none" 
                        : "bg-surface-container text-on-surface border border-white/[0.05] rounded-tl-none"}`}>
                      {m.content}
                    </div>
                    <span className="text-[8px] text-outline font-mono mt-1 px-1">{m.role === "assistant" ? "AI ANALYST" : "RESEARCHER"}</span>
                  </div>
                ))
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/[0.05] bg-black/20">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={id ? "Ask about these gaps..." : "Login to use AI Chat"}
                  disabled={!id || sending}
                  className="w-full bg-surface-container-lowest border border-white/[0.05] rounded-xl pl-4 pr-12 py-3 text-xs text-white focus:outline-none focus:border-primary/50 transition-all placeholder:text-outline/50"
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage(e)}
                />
                <button 
                  type="submit"
                  disabled={!id || sending || !input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center transition-transform hover:scale-105 active:scale-95 disabled:opacity-30"
                >
                  {sending ? <div className="spinner" style={{ width: 12, height: 12, borderWidth: 1.5 }} /> : <span className="material-symbols-outlined text-base">send</span>}
                </button>
              </div>
              <p className="text-[8px] text-center text-outline mt-3 uppercase tracking-tighter">Encrypted Neural Pipeline Active</p>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default function GapExplorerPage() {
  return (
    <Suspense fallback={<div className="p-10 text-white font-mono text-xs">Initializing Research Environment...</div>}>
      <GapExplorerContent />
    </Suspense>
  );
}
