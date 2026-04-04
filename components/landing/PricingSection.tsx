import ChangeablePricingSection, { type Plan } from '@/components/ui/changeable-pricing-section';

const pricingPlans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for testing the waters of our ATS-cracking AI.',
    priceMonthly: '$0',
    priceYearly: '$0',
    featuresLabel: 'WHAT YOU GET:',
    features: [
      { text: "3 Resume optimizes that's it", hasInfo: false },
      { text: "3 LinkedIn post generations", hasInfo: false },
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Unlimited access and dedicated platform optimizers.',
    priceMonthly: '$5',
    priceYearly: '$48',
    badge: 'POPULAR',
    featuresLabel: 'EVERYTHING IN FREE, PLUS:',
    features: [
      { text: 'Unlimited resume analyzes', hasInfo: false },
      { text: 'Make new resume', hasInfo: false },
      { text: 'LinkedIn Optimizer', hasInfo: true },
      { text: 'X Optimizer', hasInfo: true },
      { text: 'Github Optimizer', hasInfo: true },
      { text: 'LinkedIn post maker', hasInfo: false },
      { text: 'X post maker', hasInfo: false },
      { text: 'Tracks post context for Shruti to suggest next posts', hasInfo: true },
    ],
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="relative py-24 px-6 flex flex-col items-center justify-center min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-t from-transparent to-black/20 pointer-events-none" />
      
      <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-12 lg:gap-24 items-center relative z-10">
        <div className="flex-1 md:sticky md:top-24 mt-4 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,1)]" />
            <span className="text-[11px] font-semibold tracking-wider text-white uppercase">Subscription</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Deterministic Pricing.
          </h2>
          <p className="text-lg text-zinc-400 leading-relaxed max-w-md mx-auto md:mx-0">
            Secure algorithmic dominance over every hiring pipeline. No hidden fees. Upgrade when you&apos;re ready.
          </p>
          
          <div className="mt-8 flex justify-center md:justify-start w-full">
            <a href="https://watermelon.sh" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-400/50 hover:text-emerald-400 transition-colors bg-emerald-400/10 px-4 py-2 rounded-full border border-emerald-400/20 shadow-[0_0_15px_rgba(52,211,153,0.1)] hover:shadow-[0_0_25px_rgba(52,211,153,0.2)]">
                Pricing UI by Watermelon 🍉
            </a>
          </div>
        </div>

        <div className="flex-1 w-full flex items-center justify-center md:justify-end">
          <div className="dark">
            <ChangeablePricingSection
              plans={pricingPlans}
              defaultPlanId="premium"
              onContinue={(planId, cycle) => {
                  console.log(`Selected: ${planId}, Cycle: ${cycle}`)
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
