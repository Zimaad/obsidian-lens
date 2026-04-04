import type { Metadata } from "next";
import Link from "next/link";
import TopNav from "../components/TopNav";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Blog",
    description: "Insights on research innovation, AI synthesis, and the future of scholarly discovery.",
  };
}

export default function BlogIndexPage() {
  const posts = [
    {
      title: "Detecting Research Gaps with LLMs",
      slug: "detecting-research-gaps-with-llms",
      excerpt: "How large language models are revolutionizing the way we find and map research gaps, enabling scholars to see through the noise of millions of publications.",
      date: "April 2, 2026",
      readTime: "8 min read",
      category: "Innovation",
      author: "Dr. Elena Vance"
    },
    {
      title: "AI for Academic Integrity",
      slug: "ai-for-academic-integrity",
      excerpt: "Ensuring honesty and rigor in the age of generative science. A look at how AI can be a tool for transparency rather than a shortcut.",
      date: "March 28, 2026",
      readTime: "6 min read",
      category: "Ethics",
      author: "Marcus Thorne"
    },
    {
      title: "The Topology of Citations",
      slug: "topology-of-citations",
      excerpt: "Visualizing research as a living web. Why static citation lists are dying and how graph-based discovery is taking over.",
      date: "March 15, 2026",
      readTime: "12 min read",
      category: "Data Science",
      author: "Sarah Chen"
    }
  ];

  return (
    <>
      <TopNav />
      <main className="relative pt-32 pb-40 px-6 bg-cream-50 min-h-screen overflow-hidden">
        {/* Subtle Background Mesh */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
          <div className="absolute top-[20%] right-[-15%] w-[60%] h-[60%] bg-accent-soft/10 rounded-full blur-[150px] animate-pulse-slow" />
          <div className="absolute bottom-[20%] left-[-15%] w-[60%] h-[60%] bg-charcoal/5 rounded-full blur-[150px]" />
        </div>

        {/* Blog Header */}
        <div className="relative z-10 max-w-5xl mx-auto text-center mb-24 space-y-6">
          <h2 className="text-xs uppercase tracking-[0.4em] text-accent-soft font-bold">The Scholarly Log</h2>
          <h1 className="text-6xl md:text-8xl font-headline font-bold text-charcoal tracking-tight leading-[0.95]">
            Frontiers of <br /><span className="italic font-serif">Inquiry</span>.
          </h1>
          <p className="text-charcoal/60 text-lg md:text-2xl font-body max-w-2xl mx-auto leading-relaxed">
            Exploring the intersection of artificial intelligence, literature synthesis, and the future of academic discovery.
          </p>
        </div>

        {/* Featured Post Grid */}
        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          {posts.map((post) => (
            <Link 
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group relative flex flex-col p-8 rounded-[2.5rem] border border-charcoal/10 bg-white/40 backdrop-blur-md hover:bg-white/80 transition-all duration-500 hover:translate-y-[-8px] hover:shadow-premium"
            >
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full bg-accent-soft/10 text-accent-soft">
                    {post.category}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-charcoal/30">
                    {post.date}
                  </span>
                </div>
                <h3 className="text-2xl font-headline font-bold text-charcoal mb-4 group-hover:text-accent-soft transition-colors duration-300">
                  {post.title}
                </h3>
                <p className="text-charcoal/50 text-sm font-body leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              <div className="mt-auto pt-8 border-t border-charcoal/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-charcoal flex items-center justify-center text-[10px] text-cream-50 font-bold">
                    {post.author[0]}
                  </div>
                  <span className="text-xs font-bold text-charcoal/70">{post.author}</span>
                </div>
                <span className="text-[10px] font-bold text-charcoal/30 uppercase tracking-widest">
                  {post.readTime}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-40 max-w-4xl mx-auto relative z-10 p-12 md:p-20 rounded-[4rem] bg-charcoal text-cream-50 overflow-hidden group">
          <div className="absolute inset-0 bg-accent-soft/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <div className="relative z-10 max-w-xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-headline font-bold">Subscribe to the frontiers.</h2>
            <p className="text-cream-50/60 font-body text-lg leading-relaxed">
              Join 5,000+ researchers getting weekly insights on AI-driven literature discovery and synthesis strategies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-accent-soft/50 font-body text-cream-50 transition-all"
              />
              <button className="px-8 py-4 bg-cream-50 text-charcoal rounded-2xl font-bold hover:scale-105 transition-transform">
                Join Now
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
