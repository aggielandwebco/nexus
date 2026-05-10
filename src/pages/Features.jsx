import { BarChart3, Bell, Bot, CalendarDays, Mail, MessageSquare, ShieldCheck, Smartphone, Star, Users, Workflow } from "lucide-react";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import CTASection from "@/components/public/CTASection";
import FeatureCard from "@/components/public/FeatureCard";

const features = [
  [Users, "CRM", "Centralize customer profiles, notes, tags, statuses, history, and lead context so every interaction has memory."],
  [CalendarDays, "Bookings", "Manage upcoming appointments, service details, booking edits, cancellations, and daily workload planning."],
  [Star, "Reviews", "Track review performance, request new reviews, and generate clear responses for reputation management."],
  [Bot, "AI Follow-Ups", "Draft follow-up messages, reminders, review requests, customer replies, and win-back messages quickly."],
  [BarChart3, "Analytics", "Monitor bookings, revenue, customer activity, review trends, pipeline movement, and conversion visibility."],
  [Workflow, "Automations", "Prepare your business for automated customer communication, lead reminders, and operational workflows."],
  [ShieldCheck, "Team Permissions", "Support future owner, manager, and employee roles with controlled access to the dashboard."],
  [Smartphone, "Mobile Access", "Use the platform from desktop, tablet, and phone with responsive screens built for real work."],
  [Bell, "Supabase Backend Readiness", "Built to support secure user accounts, profiles, and app data through Supabase."],
  [Mail, "Future SMS/Email Automation", "Designed to expand into SMS reminders, email follow-ups, and customer lifecycle campaigns."],
  [MessageSquare, "Communication", "Keep customer outreach organized across reviews, follow-ups, reminders, and support conversations."]
];

export default function Features() {
  return (
    <div className="min-h-screen bg-[#111315] text-foreground">
      <Navbar />
      <main>
        <section className="nexus-glow py-20 md:py-28">
          <div className="nexus-container max-w-4xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Features</p>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-white md:text-6xl">Everything your customer journey needs in one platform.</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Integris Nexus brings customers, bookings, reviews, AI follow-ups, analytics, automations, team access, and future communication tools into one premium CRM experience.
            </p>
          </div>
        </section>
        <section className="py-20">
          <div className="nexus-container grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map(([Icon, title, description]) => <FeatureCard key={title} icon={Icon} title={title} description={description} />)}
          </div>
        </section>
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
