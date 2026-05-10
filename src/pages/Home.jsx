import { Link } from "react-router-dom";
import {
  AlertTriangle,
  BarChart3,
  CalendarDays,
  Car,
  CreditCard,
  Dumbbell,
  GitBranch,
  Hammer,
  Leaf,
  Scissors,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  Users,
  Utensils,
  Wand2
} from "lucide-react";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import CTASection from "@/components/public/CTASection";
import FeatureCard from "@/components/public/FeatureCard";
import PricingCard from "@/components/public/PricingCard";
import IndustryCard from "@/components/public/IndustryCard";
import DashboardPreview from "@/components/public/DashboardPreview";

const trustLabels = ["Service Businesses", "Restaurants & Bars", "Salons & Spas", "Contractors", "Gyms", "Local Brands"];

const problemCards = [
  ["Missed leads", "New opportunities slip away when inquiries live in texts, emails, and sticky notes."],
  ["Forgotten follow-ups", "Customers go quiet because nobody knows who needs the next message."],
  ["Scattered customer info", "Notes, preferences, booking history, and status updates are spread everywhere."],
  ["No review system", "Happy customers are not consistently asked for reviews at the right moment."],
  ["Manual scheduling", "Bookings take too many messages and too much back-and-forth."],
  ["Weak visibility", "Owners cannot see what is working, what is late, and where revenue is leaking."]
];

const features = [
  [Users, "Customer CRM", "Manage contacts, notes, tags, statuses, and customer history."],
  [GitBranch, "Lead Pipeline", "Track leads from new inquiry to booked job or closed sale."],
  [CalendarDays, "Booking Management", "Schedule, edit, cancel, and organize upcoming work."],
  [Star, "Reviews & Reputation", "Track reviews, request reviews, and generate AI-powered replies."],
  [Wand2, "AI Follow-Ups", "Generate reminders, review requests, and customer responses."],
  [BarChart3, "Analytics Dashboard", "Track bookings, revenue, activity, reviews, and conversions."],
  [CreditCard, "Billing Ready", "Support subscription plans and payment workflows."],
  [ShieldCheck, "Team Access", "Support owner, manager, and employee permissions later."]
];

const industries = [
  [Utensils, "Restaurants & Bars"],
  [Scissors, "Salons & Barbershops"],
  [Sparkles, "Med Spas"],
  [Dumbbell, "Gyms & Fitness"],
  [Hammer, "Contractors"],
  [Leaf, "Landscaping"],
  [Car, "Auto Detailing"],
  [Store, "Local Service Businesses"]
];

const plans = [
  ["Starter", "$99", "For small businesses getting organized.", ["CRM", "Customer profiles", "Basic bookings", "Review tracking"]],
  ["Growth", "$199", "For businesses ready to automate.", ["Everything in Starter", "AI follow-ups", "Review requests", "Analytics", "Team access"], true],
  ["Premium", "$399", "For serious operators.", ["Everything in Growth", "Advanced automation", "Multi-location support", "SMS/email reminders", "Priority setup"]]
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#111315] text-foreground">
      <Navbar />
      <main>
        <section className="nexus-glow overflow-hidden py-20 md:py-28">
          <div className="nexus-container grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Integris Systems Ecosystem</p>
              <h1 className="mt-5 max-w-4xl text-5xl font-bold tracking-tight text-white md:text-7xl">Customer Growth. Connected.</h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                Integris Nexus helps businesses manage leads, customers, bookings, reviews, follow-ups, and analytics from one powerful CRM built for modern local businesses.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/contact" className="rounded-md bg-accent px-6 py-3 text-center font-semibold text-accent-foreground transition hover:brightness-110">
                  Book a Demo
                </Link>
                <Link to="/features" className="rounded-md border border-white/10 px-6 py-3 text-center font-semibold text-white transition hover:bg-white/5">
                  View Features
                </Link>
              </div>
            </div>
            <DashboardPreview />
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#0D0F11] py-8">
          <div className="nexus-container">
            <p className="text-center text-sm text-muted-foreground">Built for growing businesses that need more than a spreadsheet.</p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              {trustLabels.map((label) => (
                <span key={label} className="rounded-full border border-white/10 px-4 py-2 text-xs text-muted-foreground">{label}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="nexus-container">
            <div className="mx-auto max-w-3xl text-center">
              <AlertTriangle className="mx-auto h-9 w-9 text-accent" />
              <h2 className="mt-5 text-3xl font-bold tracking-tight text-white md:text-5xl">Most businesses lose money because their systems do not talk to each other.</h2>
            </div>
            <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {problemCards.map(([title, description]) => <FeatureCard key={title} title={title} description={description} />)}
            </div>
          </div>
        </section>

        <section className="bg-[#0D0F11] py-20">
          <div className="nexus-container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">The Solution</p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-5xl">One place to manage the customer journey.</h2>
              <p className="mt-5 text-base leading-7 text-muted-foreground">
                Integris Nexus connects CRM, bookings, reviews, reminders, analytics, AI tools, billing, and customer communication into one organized growth platform.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {["CRM", "Bookings", "Reviews", "Reminders", "Analytics", "AI Tools", "Billing", "Communication"].map((item) => (
                <div key={item} className="rounded-xl border border-white/10 bg-[#1C1F24] p-4 text-center text-sm font-medium text-white">{item}</div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="nexus-container">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Features</p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-5xl">Built for customer growth.</h2>
            </div>
            <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {features.map(([Icon, title, description]) => <FeatureCard key={title} icon={Icon} title={title} description={description} />)}
            </div>
          </div>
        </section>

        <section className="bg-[#0D0F11] py-20">
          <div className="nexus-container">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Industries</p>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-5xl">Designed for local operators.</h2>
              </div>
              <Link to="/industries" className="text-sm font-semibold text-accent hover:text-white">View all industries</Link>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {industries.map(([Icon, title]) => <IndustryCard key={title} icon={Icon} title={title} />)}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="nexus-container">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Pricing</p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-5xl">Simple plans for serious growth.</h2>
            </div>
            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {plans.map(([name, price, description, features, highlighted]) => <PricingCard key={name} name={name} price={price} description={description} features={features} highlighted={highlighted} />)}
            </div>
            <p className="mt-6 text-center text-sm text-muted-foreground">Custom pricing available for multi-location businesses and advanced integrations.</p>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
