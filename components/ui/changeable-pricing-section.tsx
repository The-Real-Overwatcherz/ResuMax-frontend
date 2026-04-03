import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Info } from "lucide-react";

export type PlanId = string;

export interface Feature {
  text: string;
  hasInfo?: boolean;
}

export interface Plan {
  id: PlanId;
  name: string;
  description: string;
  priceMonthly: string;
  priceYearly: string;
  badge?: string;
  featuresLabel?: string;
  features: Feature[];
}

export interface ChangeablePricingSectionProps {
  /** The main title of the section */
  title?: string;
  /** Array of pricing plans to display */
  plans: Plan[];
  /** Optional ID of the default selected plan */
  defaultPlanId?: PlanId;
  /** Default billing cycle */
  defaultBillingCycle?: "monthly" | "yearly";
  /** Custom label for monthly toggle */
  monthlyLabel?: string;
  /** Custom label for yearly toggle */
  yearlyLabel?: string;
  /** Footer text below plans */
  footerText?: string;
  /** CTA button text */
  buttonText?: string;
  /** Callback fired when continue button is clicked */
  onContinue?: (planId: PlanId, billingCycle: "monthly" | "yearly") => void;
}

export default function ChangeablePricingSection({
  title = "Select a plan",
  plans,
  defaultPlanId,
  defaultBillingCycle = "monthly",
  monthlyLabel = "Monthly",
  yearlyLabel = "Yearly",
  footerText = "Cancel anytime. No long-term contract.",
  buttonText = "Continue",
  onContinue,
}: ChangeablePricingSectionProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanId>(
    defaultPlanId || (plans.length > 0 ? plans[0].id : ""),
  );
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    defaultBillingCycle,
  );

  return (
      <div className="w-full max-w-[460px] bg-black/40 backdrop-blur-md rounded-[24px] p-2 shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-4">
          <h2 className="text-[17px] font-bold text-white tracking-tighter">
            {title}
          </h2>
          <div className="flex items-center bg-white/5 border border-white/10 p-1 rounded-full relative z-0">
            <motion.div
              className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)] -z-10"
              animate={{
                x: billingCycle === "monthly" ? 0 : "100%",
              }}
              transition={{ type: "spring", bounce: 0.4, duration: 0.7 }}
              style={{ left: 4 }}
            />
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`jet w-[72px] py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-colors z-10 ${billingCycle === "monthly" ? "text-black" : "text-[#888] hover:text-white"}`}
            >
              {monthlyLabel}
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`jet w-[72px] py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-colors z-10 ${billingCycle === "yearly" ? "text-black" : "text-[#888] hover:text-white"}`}
            >
              {yearlyLabel}
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="flex flex-col gap-2 relative">
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.id;

            return (
              <motion.div
                layout
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                transition={{ type: "spring", bounce: 0.45, duration: 0.7 }}
                className={`relative overflow-hidden cursor-pointer rounded-[18px] transition-all duration-300 bg-white/5 border ${
                  isSelected
                    ? "border-emerald-500/50 bg-white/10 shadow-[0_0_20px_rgba(52,211,153,0.1)]"
                    : "border-white/5 hover:border-white/20 hover:bg-white/[0.07]"
                }`}
              >
                <div className="px-4 py-3.5 sm:px-5 sm:py-4">
                  {/* Top row */}
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex flex-1 gap-3">
                      {/* Radio button */}
                      <div className="mt-0.5 shrink-0">
                        <div
                          className={`w-[18px] h-[18px] rounded-full flex items-center justify-center border transition-colors ${
                            isSelected
                              ? "border-emerald-500 bg-emerald-500 shadow-[0_0_10px_rgba(52,211,153,0.4)]"
                              : "border-white/20 bg-transparent"
                          }`}
                        >
                          {isSelected && (
                            <Check
                              size={11}
                              strokeWidth={3.5}
                              className="text-black"
                            />
                          )}
                        </div>
                      </div>

                      {/* Plan Info */}
                      <div className="flex flex-1 flex-col">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[17px] font-bold text-white leading-none">
                            {plan.name}
                          </span>
                          {plan.badge && (
                            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider leading-none shadow-[0_0_10px_rgba(52,211,153,0.1)]">
                              {plan.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-[12px] text-zinc-400 mt-1.5 leading-snug sm:leading-none">
                          {plan.description}
                        </span>
                      </div>
                    </div>

                    {/* Price Info */}
                    <div className="flex flex-col items-end shrink-0">
                      <div className="flex items-center justify-end text-[16px] sm:text-[18px] font-bold text-white leading-none overflow-hidden h-[18px]">
                        <AnimatePresence mode="popLayout" initial={false}>
                          <motion.span
                            key={billingCycle}
                            initial={{
                              y: billingCycle === "yearly" ? 20 : -20,
                              opacity: 0,
                              filter: "blur(4px)",
                            }}
                            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                            exit={{
                              y: billingCycle === "monthly" ? -20 : 20,
                              opacity: 0,
                              filter: "blur(4px)",
                            }}
                            transition={{
                              type: "spring",
                              bounce: 0,
                              duration: 0.4,
                            }}
                            className="inline-block whitespace-nowrap"
                          >
                            {billingCycle === "monthly"
                              ? plan.priceMonthly
                              : plan.priceYearly}
                          </motion.span>
                        </AnimatePresence>
                      </div>
                      <span className="jet text-[10px] text-[#555] font-bold tracking-widest uppercase mt-1.5 leading-none">
                        per user/month
                      </span>
                    </div>
                  </div>

                  {/* Expandable Features */}
                  <AnimatePresence initial={false}>
                    {isSelected && (
                      <motion.div
                        key="features"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          opacity: { duration: 0.2 },
                          height: { duration: 0.3, ease: "easeOut" },
                        }}
                        className="overflow-hidden"
                      >
                        <div className="pt-3.5 mt-3.5 sm:pt-4 sm:mt-4 mb-1 border-t border-dashed border-white/10">
                          {plan.featuresLabel && (
                            <p className="jet text-[10px] font-bold text-white/50 tracking-widest uppercase mb-3">
                              {plan.featuresLabel}
                            </p>
                          )}
                          <div className="flex flex-col gap-3">
                            {plan.features.map((feature, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2.5"
                              >
                                <Check
                                  size={14}
                                  strokeWidth={3}
                                  className="text-emerald-500 shrink-0"
                                />
                                <span className="text-[13px] text-zinc-300 font-medium leading-tight">
                                  {feature.text}
                                </span>
                                {feature.hasInfo && (
                                  <Info
                                    size={13}
                                    className="text-zinc-600 ml-0.5"
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer info & CTA */}
        <div className="flex flex-col gap-4 items-center sm:flex-row sm:justify-between mt-6 px-3 pb-2 pt-2">
          <span className="jet text-[10px] text-zinc-500 font-medium uppercase tracking-[0.05em] leading-relaxed text-center sm:text-left">
            {footerText}
          </span>
          <button
            onClick={() => onContinue?.(selectedPlan, billingCycle)}
            className="w-full sm:w-auto bg-white text-black px-8 py-2.5 rounded-full text-[13px] font-bold uppercase tracking-widest hover:bg-gray-200 hover:shadow-[0_0_15px_rgba(255,255,255,0.4)] active:scale-95 transition-all outline-none"
          >
            {buttonText}
          </button>
        </div>
      </div>
  );
}