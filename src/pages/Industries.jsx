import { Car, Dumbbell, Hammer, Leaf, Scissors, Sparkles, Store, Utensils } from "lucide-react";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import CTASection from "@/components/public/CTASection";
import IndustryCard from "@/components/public/IndustryCard";

const industries = [
  [Utensils, "Restaurants & Bars", "Capture inquiries, manage events, improve reviews, and keep customer follow-ups consistent."],
  [Scissors, "Salons & Barbers", "Organize clients, bookings, preferences, review requests, and repeat-visit reminders."],
  [Sparkles, "Med Spas", "Track consultations, appointments, customer history, and reputation growth."],
  [Hammer, "Contractors", "Manage leads, estimates, jobs, customer notes, booking windows, and follow-up reminders."],
  [Leaf, "Landscapers", "Keep seasonal clients, service schedules, quotes, and recurring follow-ups organized."],
  [Car, "Auto Detailers", "Manage packages, appointments, customer vehicles, reviews, and repeat business."],
  [Dumbbell, "Gyms", "Track leads, member interest, follow-ups, trial appointments, and local reputation."],
  [Store, "Local Retail", "Build customer profiles, collect feedback, request reviews, and understand local growth trends."]
];

export default function Industries() {
  return (
    <div className="min-h-screen bg-[#111315] text-foreground">
      <Navbar />
      <main>
        <section className="nexus-glow py-20 md:py-28">
          <div className="nexus-container max-w-4xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Industries</p>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-white md:text-6xl">Built for businesses that run on relationships.</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">Nexus helps local operators manage customers, leads, bookings, reviews, and follow-ups without adding another messy spreadsheet.</p>
          </div>
        </section>
        <section className="py-20">
          <div className="nexus-container grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {industries.map(([Icon, title, description]) => <IndustryCard key={title} icon={Icon} title={title} description={description} />)}
          </div>
        </section>
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
