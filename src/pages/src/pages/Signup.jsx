import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    businessName: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const { error: signupError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.fullName,
          business_name: form.businessName
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
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-md rounded-lg border bg-card p-6 shadow-sm"
      >
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign up for AW Nexus.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium">Full name</label>
            <input
              value={form.fullName}
              onChange={(event) => updateField("fullName", event.target.value)}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Business name</label>
            <input
              value={form.businessName}
              onChange={(event) =>
                updateField("businessName", event.target.value)
              }
              className="mt-1 w-full rounded-md border bg-background px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(event) => updateField("password", event.target.value)}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2"
              minLength={6}
              required
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {message && <p className="text-sm text-primary">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary">
              Log in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
