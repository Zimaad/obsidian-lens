import type { Metadata } from "next";
import Link from "next/link";
import TopNav from "../../components/TopNav";

const blogPostsContent: Record<string, any> = {
  "detecting-research-gaps-with-llms": {
    title: "Detecting Research Gaps with LLMs",
    author: "Dr. Elena Vance",
    date: "April 2, 2026",
    description: "Discover how AI-driven literature synthesis is revealing the hidden frontiers of science.",
    content: (
      <>
        <p className="text-xl leading-relaxed first-letter:text-6xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:font-serif mb-8">
          The acceleration of research publication is reaching a historical saturation point. As of 2026, millions of scholarly papers are published annually, making it humanly impossible for even the most dedicated researcher to maintain a holistic view of several fields.
        </p>
        <h2 className="text-3xl font-headline font-bold text-charcoal my-10 tracking-tight">The Information Horizon</h2>
        <p className="mb-6">
          How many times has a researcher embarked on a three-year PhD project only to find, halfway through, that a team in Zurich or Singapore had already published the same findings three years prior—buried under a slightly different keyword or within a different discipline?
        </p>
        <p className="mb-6 italic text-charcoal/60 border-l-4 border-accent-soft pl-6 py-4 bg-accent-soft/5 rounded-r-2xl">
          "The biggest research risk today is not failure—it's redundant discovery."
        </p>
        <h2 className="text-3xl font-headline font-bold text-charcoal my-10 tracking-tight">Semantic Synthesis: Beyond Keywords</h2>
        <p className="mb-6 font-body">
          Traditional literature review relies on keyword matching. If you're researching "distributed ledger efficiency" but someone else calls it "decentralized transaction consensus optimization," you will miss it. Large Language Models (LLMs) solve this by mapping research into a <b>vibrant semantic vector space.</b>
        </p>
        <p className="mb-10 leading-relaxed font-body">
          Hiatus uses a proprietary synthesis agent that doesn't just read summaries—it maps the logical claims of each paper. When these claim structures fail to connect, or when they contradict each other without rebuttal, the 'gap' is automatically flagged. These are the frontiers of science.
        </p>
      </>
    )
  },
  "ai-for-academic-integrity": {
    title: "AI for Academic Integrity",
    author: "Marcus Thorne",
    date: "March 28, 2026",
    description: "Ensuring clarity and honesty in research through AI-powered consistency checks.",
    content: (
      <>
        <p className="text-xl leading-relaxed first-letter:text-6xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:font-serif mb-8">
          The conversation around AI in academia often focuses on plagiarism and cheating. But this is a primitive view. The real potential of AI is not in generating words for students—it's in ensuring the integrity of the scientific <i>network</i>.
        </p>
        <h2 className="text-3xl font-headline font-bold text-charcoal my-10 tracking-tight">Detecting Systematic Bias</h2>
        <p className="mb-6">
          Academic integrity isn't just about citation; it's about the truth. Reproducibility crises have plagued psychology, medicine, and AI for a decade. Why? Because identifying contradictory findings across 50,000 papers in a sub-discipline is impossible for human reviewers.
        </p>
        <p className="mb-6">
          By utilizing LLMs to cross-reference experimental parameters across thousands of studies, we can identify anomalies. If one lab persistently reports high significance while ten others with the same parameters report null results, AI should flag this for review.
        </p>
        <h2 className="text-3xl font-headline font-bold text-charcoal my-10 tracking-tight">The AI-Verified Future</h2>
        <p className="mb-6 font-body">
          We envision a future where journals don't just rely on two human reviewers. They utilize a synthesis audit that checks for internal consistency, verification of data sources, and most importantly, the presence of citation-padding.
        </p>
      </>
    )
  },
  "topology-of-citations": {
    title: "The Topology of Citations",
    author: "Sarah Chen",
    date: "March 15, 2026",
    description: "Visualizing the hidden architecture of scientific discovery through graph theory.",
    content: (
      <>
        <p className="text-xl leading-relaxed first-letter:text-6xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:font-serif mb-8">
          Stop thinking of citations as a list. A list is a one-dimensional representation of a multi-dimensional intellectual landscape. To truly understand a discovery, you must see the <i>shape</i> of its descent.
        </p>
        <h2 className="text-3xl font-headline font-bold text-charcoal my-10 tracking-tight">Graph-Based Discovery</h2>
        <p className="mb-6">
          When we visualize citations as nodes in a graph, we see clusters, bridges, and outliers. A 'bridge' paper that connects two seemingly unrelated fields (like biology and graph theory) is often where the next breakthrough occurs.
        </p>
      </>
    )
  }
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPostsContent[slug];
  if (!post) return { title: "Post Not Found" };
  
  return {
    title: post.title,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPostsContent[slug];

  if (!post) {
    return (
      <>
        <TopNav />
        <div className="pt-40 text-center bg-cream-50 min-h-screen font-headline font-bold text-4xl text-charcoal">
          Article not found.
        </div>
      </>
    );
  }

  return (
    <div className="bg-cream-50 min-h-screen">
      <TopNav />
      
      {/* Article Header */}
      <header className="relative pt-40 pb-20 px-6 max-w-4xl mx-auto text-center border-b border-charcoal/5">
        <div className="flex flex-col items-center gap-6 mb-8">
          <Link href="/blog" className="text-xs uppercase tracking-widest font-bold text-accent-soft hover:underline">
            Back to Blog
          </Link>
          <div className="flex items-center gap-4 text-xs font-bold text-charcoal/40 uppercase tracking-widest">
            <span>{post.date}</span>
            <span className="w-1 h-1 bg-charcoal/20 rounded-full" />
            <span>by {post.author}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-headline font-bold text-charcoal tracking-tight leading-[0.95]">
            {post.title}
          </h1>
        </div>
      </header>

      {/* Article Content */}
      <article className="max-w-3xl mx-auto px-6 py-20 font-body text-charcoal/80">
        <div className="prose prose-lg prose-charcoal mx-auto">
          {post.content}
        </div>
      </article>

      {/* Recommended Reading Footer */}
      <footer className="max-w-7xl mx-auto px-6 pb-40">
        <div className="h-px bg-charcoal/10 mb-20" />
        <h3 className="text-3xl font-headline font-bold text-charcoal mb-12">Continue Exploring</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.entries(blogPostsContent)
            .filter(([slugKey]) => slugKey !== slug)
            .slice(0, 2)
            .map(([slugKey, data]) => (
              <Link 
                key={slugKey} 
                href={`/blog/${slugKey}`}
                className="group p-8 rounded-[2rem] border border-charcoal/5 bg-white/40 hover:bg-white/80 transition-all duration-300"
              >
                <span className="text-[10px] font-bold text-accent-soft uppercase tracking-widest mb-4 inline-block">Next Story</span>
                <h4 className="text-xl font-headline font-bold text-charcoal group-hover:text-accent-soft transition-colors">{data.title}</h4>
              </Link>
            ))}
        </div>
      </footer>
    </div>
  );
}
