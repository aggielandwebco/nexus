import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import AuthLayout from "@/components/public/AuthLayout";

const inputClass = "mt-1 w-full rounded-md border border-white/10 bg-[#111315] px-3 py-2.5 text-white outline-none transition focus:border-accent";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password
    });

    setLoading(false);

    if (loginError) {
      setError(loginError.message);
      return;
    }

    navigate("/app");
  };

  return (
    <AuthLayout title="Log in" subtitle="Access your Integris Nexus dashboard.">
      <form onSubmit={handleLogin} className="space-y-4">
        <label className="block text-sm font-medium text-white">
          Email
          <input type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} className={inputClass} required />
        </label>
        <label className="block text-sm font-medium text-white">
          Password
          <input type="password" value={form.password} onChange={(event) => updateField("password", event.target.value)} className={inputClass} required />
        </label>
        <div className="text-right">
          <button type="button" className="text-sm text-accent hover:text-white">Forgot password?</button>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button type="submit" disabled={loading} className="w-full rounded-md bg-accent px-4 py-3 font-semibold text-accent-foreground transition hover:brightness-110 disabled:opacity-60">
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="text-center text-sm text-muted-foreground">
          Need an account? <Link to="/signup" className="text-accent hover:text-white">Sign up</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
