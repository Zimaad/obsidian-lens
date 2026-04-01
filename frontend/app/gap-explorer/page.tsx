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
  
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!id || !user) return;
    const chatsRef = collection(db, "chats");
    const q = query(chatsRef, where("analysisId", "==", id), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const chatData = snapshot.docs[0].data();
        setMessages(chatData.messages || []);
      } else {
        setMessages([]);
      }
    });
    return () => unsubscribe();
  }, [id, user]);

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

      // Backend call to get AI response
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          topic: analysis?.topic || "Unknown research",
          message: userMessage,
          context: analysis ? JSON.stringify(analysis.gaps?.slice(0,3)) : ""
        }),
      });
      const data = await res.json();
      
      if (data && data.response) {
        const aiMessage = { role: "assistant", content: data.response, timestamp: new Date() };
        await updateDoc(doc(db, "chats", chatId), {
          messages: arrayUnion(aiMessage),
          updatedAt: serverTimestamp()
        });
      }
    } catch (err) {
      console.error("Chat error:", err);
    } finally {
      setSending(false);
    }
  };

  if (loading) return (
    <div className="p-10 flex items-center justify-center min-h-[50vh]">
       <div className="flex flex-col items-center gap-6">
          <div className="spinner !w-10 !h-10 border-4" />
          <p className="font-headline text-[10px] uppercase font-bold tracking-[0.4em] text-charcoal/40 animate-pulse">Navigating Nodal Tunnels...</p>
       </div>
    </div>
  );

  if (!id || !analysis) {
    return (
      <AppLayout>
        <div className="p-10 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[70vh] text-center page-enter">
          <div className="w-20 h-20 rounded-3xl bg-charcoal/5 flex items-center justify-center mb-10 transition-transform hover:scale-110">
            <span className="material-symbols-outlined text-4xl text-charcoal/20">search_check</span>
          </div>
          <h1 className="text-4xl font-headline font-bold text-charcoal mb-6">No Node Selected</h1>
          <p className="text-charcoal/50 font-body mb-12 max-w-md">The Gap Explorer requires a synchronized research analysis to map literature frontiers. Navigate to your library to select a node.</p>
          <div className="flex gap-6">
            <Link href="/library" className="btn-primary !px-10 !py-4 rounded-2xl shadow-premium">
              <span className="material-symbols-outlined">book_4</span>
              <span>Open Library</span>
            </Link>
            <Link href="/dashboard" className="btn-ghost !px-10 !py-4 rounded-2xl border-charcoal/10 font-bold">
              <span>Go to Dash</span>
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="px-4 py-6 w-full page-enter h-[calc(100vh-60px)] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 shrink-0 stagger-container border-b border-charcoal/5 pb-6">
          <div className="stagger-item">
            <p className="font-headline text-[9px] uppercase font-bold tracking-[0.3em] text-accent-soft mb-1">Synthesized Frontiers</p>
            <h1 className="text-4xl font-headline font-bold text-charcoal tracking-tight">{analysis.topic}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="px-2 py-0.5 rounded-lg bg-charcoal/5 border border-charcoal/5 text-[9px] font-headline font-bold text-charcoal/40 uppercase tracking-widest">{analysis.field || "General Domain"}</span>
              <span className="w-1 h-1 rounded-full bg-charcoal/10" />
              <span className="text-[9px] font-headline font-bold text-charcoal/30 uppercase tracking-widest">Analysis ID: {id.slice(0,8)}...</span>
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Main Gaps content */}
          <div className="lg:col-span-3 overflow-y-auto space-y-6 pr-4 custom-scrollbar pb-6">
            <section className="space-y-6">
              <p className="font-headline text-[10px] uppercase font-bold tracking-widest text-charcoal/40">{analysis.gaps?.length || 0} Critical Gaps Identified</p>
              {analysis.gaps?.map((gap: any, i: number) => (
                <div 
                  key={i} 
                  className="glass-card rounded-3xl p-6 group hover:bg-white/60 hover:shadow-premium transition-all duration-300 stagger-item border border-charcoal/5"
                  style={{ "--stagger-delay": `${i * 100}ms` } as React.CSSProperties}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <span className="font-headline text-[10px] font-bold text-accent-soft tracking-[0.2em] uppercase bg-accent-soft/5 px-2 py-0.5 rounded-lg">GAP {String(i+1).padStart(2, "0")}</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-charcoal/10" />
                    <span className="px-2 py-0.5 rounded-lg bg-charcoal/5 text-charcoal/40 font-headline text-[9px] uppercase font-bold tracking-widest">Validated Protocol</span>
                  </div>
                  <h3 className="text-2xl font-headline font-bold text-charcoal mb-3 leading-tight">{gap.gap || gap.title}</h3>
                  <p className="text-sm text-charcoal/60 leading-relaxed font-body mb-6">{gap.description || gap.desc || "Structural divergence detected in methodology trails. Awaiting expanded synthesis."}</p>
                  
                  <div className="flex gap-6 border-t border-charcoal/5 pt-4">
                    <button className="text-[10px] font-headline font-bold uppercase tracking-widest text-charcoal/40 hover:text-charcoal transition-colors flex items-center gap-2 group/btn">
                       <span className="material-symbols-outlined text-[16px] text-accent-soft group-hover/btn:scale-110 transition-transform">database</span> Expand Evidence
                    </button>
                    <button className="text-[10px] font-headline font-bold uppercase tracking-widest text-charcoal/40 hover:text-charcoal transition-colors flex items-center gap-2 group/btn">
                       <span className="material-symbols-outlined text-[16px] text-charcoal/20 group-hover/btn:scale-110 transition-transform">hub</span> Trace Origins
                    </button>
                  </div>
                </div>
              ))}
            </section>

            {/* Contradictions */}
            {(analysis.contradictions?.length > 0) && (
              <section className="space-y-6 pt-8 border-t border-charcoal/5">
                <p className="font-headline text-[10px] uppercase font-bold tracking-widest text-charcoal/40">Latent Contradictions Detected</p>
                {analysis.contradictions.map((c: any, i: number) => (
                  <div key={i} className="glass-card border border-red-500/10 rounded-3xl p-6 bg-red-50/20 shadow-premium">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 shadow-sm">
                        <span className="material-symbols-outlined text-xl">crisis_alert</span>
                      </div>
                      <span className="font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-red-600/60">Contradiction Node {i+1}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="p-4 rounded-2xl bg-white/60 border border-red-500/5 text-sm italic text-charcoal/80 font-body relative shadow-inner">
                        <span className="absolute -top-3 left-6 bg-cream-50 px-3 text-[9px] font-bold uppercase text-red-500/30 tracking-widest">Thesis A</span>
                        &ldquo;{c.a}&rdquo;
                      </div>
                      <div className="p-4 rounded-2xl bg-white/60 border border-red-500/5 text-sm italic text-charcoal/80 font-body relative shadow-inner">
                        <span className="absolute -top-3 left-6 bg-cream-50 px-3 text-[9px] font-bold uppercase text-red-500/30 tracking-widest">Antithesis B</span>
                        &ldquo;{c.b}&rdquo;
                      </div>
                    </div>
                    <div className="flex items-center gap-4 bg-white/40 p-4 rounded-xl border border-charcoal/5">
                       <span className="material-symbols-outlined text-charcoal/20">terminal</span>
                       <p className="text-xs text-charcoal/60 font-body leading-relaxed">{c.analysis || "The conflict centers on diverging nodal entropy under long-horizon inference loads."}</p>
                    </div>
                  </div>
                ))}
              </section>
            )}
          </div>

          {/* AI Chat Right Side panel */}
          <div className="lg:col-span-2 flex flex-col glass-card rounded-[2.5rem] overflow-hidden bg-white/40 shadow-premium border border-charcoal/5">
            <div className="p-6 border-b border-charcoal/5 flex items-center justify-between bg-white/40 backdrop-blur-xl">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-charcoal flex items-center justify-center text-cream-50 shadow-lg transform -rotate-3">
                  <span className="material-symbols-outlined text-2xl">psychology</span>
                </div>
                <div>
                  <h3 className="text-[11px] font-headline font-bold text-charcoal uppercase tracking-[0.3em]">Neural Analyst</h3>
                  <p className="text-[9px] text-accent-soft font-headline font-bold uppercase tracking-widest flex items-center gap-2 mt-1">
                     <span className="w-1 h-1 rounded-full bg-accent-soft animate-ping" />
                     Quantum Link Secure
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-cream-100/10">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-12 opacity-30">
                  <div className="w-16 h-16 rounded-full border border-dashed border-charcoal/20 flex items-center justify-center mb-8">
                     <span className="material-symbols-outlined text-3xl">forum</span>
                  </div>
                  <h4 className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-charcoal mb-4">Awaiting Synthesis Query</h4>
                  <p className="text-xs font-body text-charcoal/60 max-w-[200px]">Ask questions about the identified gaps, methodologies, or future research directions.</p>
                </div>
              ) : (
                messages.map((m: any, i: number) => (
                  <div key={i} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
                    <div className={`max-w-[95%] p-5 rounded-3xl text-sm leading-relaxed font-body shadow-soft
                      ${m.role === "user" 
                        ? "bg-charcoal text-cream-50 rounded-tr-none" 
                        : "bg-white text-charcoal border border-charcoal/5 rounded-tl-none shadow-premium/5"}`}>
                      {m.content}
                    </div>
                    <div className="flex items-center gap-3 mt-3 px-1">
                       <span className="text-[8px] text-charcoal/30 font-headline font-bold uppercase tracking-[0.2em]">{m.role === "assistant" ? "Neural Core" : "Principal Researcher"}</span>
                    </div>
                  </div>
                ))
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-8 border-t border-charcoal/5 bg-white/40 backdrop-blur-xl">
              <form onSubmit={handleSendMessage} className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Probe latent knowledge..."
                  disabled={sending}
                  className="w-full bg-white/80 border border-charcoal/10 rounded-2xl pl-6 pr-16 py-5 text-sm text-charcoal focus:outline-none focus:border-charcoal/30 transition-all font-body shadow-inner placeholder:text-charcoal/20"
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage(e)}
                />
                <button 
                  type="submit"
                  disabled={sending || !input.trim()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-charcoal text-cream-50 flex items-center justify-center transition-all hover:bg-black active:scale-95 disabled:opacity-20 shadow-premium"
                >
                  {sending ? <div className="spinner !w-5 !h-5 !border-cream-50/20 !border-t-cream-50" /> : <span className="material-symbols-outlined text-xl">send</span>}
                </button>
              </form>
              <p className="text-[8px] text-charcoal/30 text-center mt-6 font-headline font-bold uppercase tracking-widest">Multi-modal context injection active</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default function GapExplorerPage() {
  return (
    <Suspense fallback={
       <div className="p-10 flex items-center justify-center min-h-screen">
          <div className="spinner !w-12 !h-12 border-charcoal/5 border-t-accent-soft" />
       </div>
    }>
      <GapExplorerContent />
    </Suspense>
  );
}


