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
      description: "For individual PhD students and independent scholars.",
      features: [
        "1,000 papers analyzed/month",
        "Basic contradiction mapping",
        "Citation trail visualization",
        "Standard support"
      ],
      cta: "Start Free",
      href: "/signup",
      highlight: false
    },
    {
      name: "Pro",
      price: "$18",
      period: "/month",
      description: "For active research labs and post-doc teams.",
      features: [
        "Unlimited papers analyzed",
        "Deep semantic synthesis",
        "Reproducibility risk detection",
        "Priority API access",
        "Team collaboration"
      ],
      cta: "Get Pro",
      href: "/signup",
      highlight: true
    }
  ];

  return (
    <>
      <TopNav />
      <main className="pt-32 pb-20 px-6 bg-cream-50 min-h-screen">
        <div className="max-w-5xl mx-auto text-center mb-20 space-y-4">
          <h1 className="text-5xl md:text-7xl font-headline font-bold text-charcoal tracking-tight">Simple Pricing.</h1>
          <p className="text-charcoal/60 text-lg md:text-xl font-body max-w-2xl mx-auto">
            Focus on discovery, not costs. All plans include our core autonomous research agents.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`relative p-10 rounded-3xl border ${plan.highlight ? 'border-charcoal bg-white shadow-premium' : 'border-charcoal/10 bg-white/50'}`}
            >
              {plan.highlight && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent-soft text-cream-50 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  Popular
                </span>
              )}
              <h3 className="text-2xl font-headline font-bold text-charcoal mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-headline font-bold text-charcoal">{plan.price}</span>
                {plan.period && <span className="text-charcoal/40 font-body">{plan.period}</span>}
              </div>
              <p className="text-charcoal/60 text-sm mb-8 font-body leading-relaxed">{plan.description}</p>
              
              <ul className="space-y-4 mb-10">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm font-medium text-charcoal/80">
                    <span className="material-symbols-outlined text-accent-soft" style={{ fontSize: "18px" }}>check_circle</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link 
                href={plan.href}
                className={`block w-full py-4 rounded-xl text-center font-bold transition-all duration-300 ${plan.highlight ? 'bg-charcoal text-cream-50 hover:bg-black' : 'bg-charcoal/5 text-charcoal hover:bg-charcoal/10'}`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
