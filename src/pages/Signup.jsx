import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import AuthLayout from "@/components/public/AuthLayout";

const inputClass = "mt-1 w-full rounded-md border border-white/10 bg-[#111315] px-3 py-2.5 text-white outline-none transition focus:border-accent";

export default function Signup() {
  const [form, setForm] = useState({
    fullName: "",
    businessName: "",
    email: "",
    password: "",
    confirmPassword: "",
    plan: "Growth",
    agreed: false
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSignup = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (form.password !== form.confirmPassword) {
      setLoading(false);
      setError("Passwords do not match.");
      return;
    }

    if (!form.agreed) {
      setLoading(false);
      setError("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }

    const { error: signupError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.fullName,
          business_name: form.businessName,
          plan: form.plan
        }
      }
    });

    setLoading(false);

    if (signupError) {
      setError(signupError.message);
      return;
    }

    setMessage("Account created. Check your email to confirm your signup.");
  };

  return (
    <AuthLayout title="Create your account" subtitle="Start your Integris Nexus setup.">
      <form onSubmit={handleSignup} className="space-y-4">
        <label className="block text-sm font-medium text-white">Full name<input value={form.fullName} onChange={(event) => updateField("fullName", event.target.value)} className={inputClass} required /></label>
        <label className="block text-sm font-medium text-white">Business name<input value={form.businessName} onChange={(event) => updateField("businessName", event.target.value)} className={inputClass} required /></label>
        <label className="block text-sm font-medium text-white">Email<input type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} className={inputClass} required /></label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-white">Password<input type="password" value={form.password} onChange={(event) => updateField("password", event.target.value)} className={inputClass} minLength={6} required /></label>
          <label className="block text-sm font-medium text-white">Confirm password<input type="password" value={form.confirmPassword} onChange={(event) => updateField("confirmPassword", event.target.value)} className={inputClass} minLength={6} required /></label>
        </div>
        <label className="block text-sm font-medium text-white">
          Plan selection
          <select value={form.plan} onChange={(event) => updateField("plan", event.target.value)} className={inputClass}>
            <option>Starter</option>
            <option>Growth</option>
            <option>Premium</option>
          </select>
        </label>
        <label className="flex items-start gap-3 text-sm text-muted-foreground">
          <input type="checkbox" checked={form.agreed} onChange={(event) => updateField("agreed", event.target.checked)} className="mt-1" />
          I agree to the Terms of Service and Privacy Policy.
        </label>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {message && <p className="text-sm text-accent">{message}</p>}
        <button type="submit" disabled={loading} className="w-full rounded-md bg-accent px-4 py-3 font-semibold text-accent-foreground transition hover:brightness-110 disabled:opacity-60">
          {loading ? "Creating account..." : "Create Account"}
        </button>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account? <Link to="/login" className="text-accent hover:text-white">Log in</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
