import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import CTASection from "@/components/public/CTASection";
import PricingCard from "@/components/public/PricingCard";

const plans = [
  ["Starter", "$99", "For small businesses getting organized.", ["CRM", "Customer profiles", "Basic bookings", "Review tracking"]],
  ["Growth", "$199", "For businesses ready to automate.", ["Everything in Starter", "AI follow-ups", "Review requests", "Analytics", "Team access"], true],
  ["Premium", "$399", "For serious operators.", ["Everything in Growth", "Advanced automation", "Multi-location support", "SMS/email reminders", "Priority setup"]]
];

const faqs = [
  ["Can I cancel anytime?", "Yes. Plans are designed to be flexible as your business changes."],
  ["Do you support multiple locations?", "Premium and custom plans can support multi-location businesses and advanced setups."],
  ["Is setup included?", "Priority setup is included with Premium. Starter and Growth can request setup help during onboarding."],
  ["Can employees have their own login?", "Team access is planned for owner, manager, and employee roles."],
  ["Will SMS reminders be available?", "Yes. SMS and email reminders are part of the planned automation roadmap."]
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-[#111315] text-foreground">
      <Navbar />
      <main>
        <section className="nexus-glow py-20 md:py-28">
          <div className="nexus-container max-w-4xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Pricing</p>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-white md:text-6xl">Choose the growth system that fits your business.</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">Simple monthly plans with room for custom multi-location and advanced integration needs.</p>
          </div>
        </section>
        <section className="py-20">
          <div className="nexus-container">
            <div className="grid gap-5 lg:grid-cols-3">
              {plans.map(([name, price, description, features, highlighted]) => <PricingCard key={name} name={name} price={price} description={description} features={features} highlighted={highlighted} />)}
            </div>
            <p className="mt-6 text-center text-sm text-muted-foreground">Custom pricing available for multi-location businesses and advanced integrations.</p>
          </div>
        </section>
        <section className="bg-[#0D0F11] py-20">
          <div className="nexus-container max-w-4xl">
            <h2 className="text-3xl font-bold text-white">FAQ</h2>
            <div className="mt-8 divide-y divide-white/10 rounded-2xl border border-white/10 bg-[#1C1F24]">
              {faqs.map(([question, answer]) => (
                <div key={question} className="p-6">
                  <h3 className="font-semibold text-white">{question}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
