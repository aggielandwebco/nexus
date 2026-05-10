import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#111315] text-foreground">
      <Navbar />
      <main className="nexus-container py-20">
        <h1 className="text-4xl font-bold text-white">Terms of Service</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">This page is a placeholder and can be replaced with your official terms of service.</p>
      </main>
      <Footer />
    </div>
  );
}
