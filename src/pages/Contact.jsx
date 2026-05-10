import { useState } from "react";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";

const inputClass = "mt-1 w-full rounded-md border border-white/10 bg-[#111315] px-3 py-2.5 text-white outline-none transition placeholder:text-muted-foreground focus:border-accent";

export default function Contact() {
  const [success, setSuccess] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#111315] text-foreground">
      <Navbar />
      <main className="nexus-glow py-20 md:py-28">
        <div className="nexus-container grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Book a Demo</p>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-white md:text-6xl">See how Nexus can fit your business.</h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">Tell us about your business and we will follow up with a practical walkthrough of customer management, bookings, reviews, AI follow-ups, and analytics.</p>
          </div>

          <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-[#1C1F24]/90 p-6 shadow-2xl shadow-black/20">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium text-white">Name<input className={inputClass} required /></label>
              <label className="text-sm font-medium text-white">Business name<input className={inputClass} required /></label>
              <label className="text-sm font-medium text-white">Email<input type="email" className={inputClass} required /></label>
              <label className="text-sm font-medium text-white">Phone<input className={inputClass} /></label>
              <label className="text-sm font-medium text-white">Industry<input className={inputClass} placeholder="Restaurant, salon, contractor..." /></label>
              <label className="text-sm font-medium text-white">Website<input className={inputClass} placeholder="https://" /></label>
            </div>
            <label className="mt-4 block text-sm font-medium text-white">Message<textarea className={`${inputClass} min-h-32`} placeholder="What are you trying to improve?" /></label>
            {success && <p className="mt-4 rounded-md border border-accent/30 bg-accent/10 p-3 text-sm text-accent">Demo request received. We will follow up soon.</p>}
            <button type="submit" className="mt-5 w-full rounded-md bg-accent px-4 py-3 font-semibold text-accent-foreground transition hover:brightness-110">Submit Demo Request</button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
