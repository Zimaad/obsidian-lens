import type { Metadata } from "next";
import Link from "next/link";
import TopNav from "../components/TopNav";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Pricing",
    description: "Choose the plan that fits your research needs. From academic discovery to industrial R&D.",
  };
}

export default function PricingPage() {
  const plans = [
    {
      name: "Researcher",
      price: "$0",
      description: "Ideal for PhD students, independent scholars, and early-career researchers mapping new fields.",
      features: [
        "1,000 papers analyzed / month",
        "Basic contradiction mapping",
        "Citation trail visualization",
        "Public knowledge graph access",
        "Standard processing speed"
      ],
      cta: "Get Started",
      href: "/signup",
      highlight: false,
      tagline: "Academic Freedom"
    },
    {
      name: "Pro",
      price: "$18",
      period: "/month",
      description: "For active research labs, post-doc teams, and industrial R&D departments requiring deep synthesis.",
      features: [
        "Unlimited papers analyzed",
        "Deep semantic synthesis agent",
        "Reproducibility risk detection",
        "Priority API access for automation",
        "Private collaborative collections",
        "Advanced topological gap maps"
      ],
      cta: "Get Pro Access",
      href: "/signup",
      highlight: true,
      tagline: "High-Fidelity Research"
    },
    {
      name: "Institution",
      price: "Custom",
      description: "Enterprise-grade infrastructure for universities and large multi-disciplinary research institutions.",
      features: [
        "On-premise deployment options",
        "SAML / Single Sign-On (SSO)",
        "Audit logs & compliance reports",
        "Dedicated research engineer support",
        "Custom citation network tuning"
      ],
      cta: "Contact Sales",
      href: "/contact",
      highlight: false,
      tagline: "Enterprise Scale"
    }
  ];

  const faqs = [
    { q: "How are papers counted?", a: "We count every unique DOI our agents process via Semantic Scholar, ArXiv, or your uploaded PDFs." },
    { q: "Can I cancel anytime?", a: "Yes. Hiatus is a month-to-month service. You can downgrade or cancel at any time via settings." },
    { q: "Do you offer university discounts?", a: "The 'Researcher' tier is permanently free for verified .edu emails. Institutional discounts are available for bulk seats." },
    { q: "Is my research data private?", a: "In the Pro and Institution tiers, your analysis collections and private notes are encrypted and never used for training." }
  ];

  return (
    <>
      <TopNav />
      <main className="relative pt-32 pb-40 px-6 bg-cream-50 min-h-screen overflow-hidden">
        {/* Subtle Background Mesh */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent-soft/10 rounded-full blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-charcoal/5 rounded-full blur-[120px]" />
        </div>

        {/* Hero Section */}
        <div className="relative z-10 max-w-5xl mx-auto text-center mb-24 space-y-6">
          <h2 className="text-xs uppercase tracking-[0.4em] text-accent-soft font-bold">Investment in Discovery</h2>
          <h1 className="text-6xl md:text-8xl font-headline font-bold text-charcoal tracking-tight leading-[0.95]">
            Plans for the <br /><span className="italic font-serif">frontiers</span> of science.
          </h1>
          <p className="text-charcoal/60 text-lg md:text-2xl font-body max-w-2xl mx-auto leading-relaxed">
            Scalable intelligence for literature mapping, from individual PhD theses to global institutional R&D.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mb-40">
          {plans.map((plan, i) => (
            <div 
              key={plan.name}
              className={`relative flex flex-col p-10 rounded-[2.5rem] border transition-all duration-500 hover:translate-y-[-8px] ${
                plan.highlight 
                  ? 'border-charcoal bg-white shadow-premium scale-105 z-20' 
                  : 'border-charcoal/10 bg-white/40 backdrop-blur-md hover:bg-white/60'
              }`}
            >
              <div className="mb-10">
                <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full mb-4 inline-block ${
                  plan.highlight ? 'bg-accent-soft text-cream-50' : 'bg-charcoal/5 text-charcoal/60'
                }`}>
                  {plan.tagline}
                </span>
                <h3 className="text-3xl font-headline font-bold text-charcoal mb-4">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-5xl font-headline font-bold text-charcoal">{plan.price}</span>
                  {plan.period && <span className="text-charcoal/40 font-body text-xl">{plan.period}</span>}
                </div>
                <p className="text-charcoal/50 text-sm font-body leading-relaxed">{plan.description}</p>
              </div>

              <div className="flex-1">
                <h4 className="text-xs font-bold uppercase tracking-widest text-charcoal/30 mb-6">Capabilities</h4>
                <ul className="space-y-5 mb-12">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-4 text-sm font-medium text-charcoal/80">
                      <span className="material-symbols-outlined text-accent-soft mt-0.5" style={{ fontSize: "20px" }}>check_circle</span>
                      <span className="leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link 
                href={plan.href}
                className={`block w-full py-5 rounded-2xl text-center font-bold transition-all duration-300 transform active:scale-[0.98] ${
                  plan.highlight 
                    ? 'bg-charcoal text-cream-50 shadow-lg hover:bg-black hover:shadow-xl' 
                    : 'bg-charcoal/5 text-charcoal hover:bg-charcoal/10'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <section className="relative z-10 max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-headline font-bold text-charcoal mb-4">Frequently Asked Questions</h2>
            <div className="w-12 h-1 bg-accent-soft mx-auto rounded-full" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {faqs.map((faq) => (
              <div key={faq.q} className="space-y-3">
                <h4 className="text-lg font-headline font-bold text-charcoal">{faq.q}</h4>
                <p className="text-charcoal/60 font-body text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="mt-40 text-center relative z-10 p-16 rounded-[4rem] bg-charcoal text-cream-50 overflow-hidden group">
          <div className="absolute inset-0 bg-accent-soft/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <h2 className="text-5xl font-headline font-bold mb-8 relative z-10">Map the unknown today.</h2>
          <Link href="/signup" className="btn-primary !bg-cream-50 !text-charcoal !px-12 !py-5 !rounded-2xl !text-lg relative z-10 shadow-xl hover:scale-105 transition-transform">
            Create Free Account
          </Link>
        </div>
      </main>
    </>
  );
}
