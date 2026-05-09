import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Developer() {
  const [profiles, setProfiles] = useState([]);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    setLoading(true);
    setError("");

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be logged in to view this page.");
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) {
      setError(profileError.message);
      setLoading(false);
      return;
    }

    setCurrentProfile(profile);

    if (profile.role !== "developer") {
      setError("You do not have developer access.");
      setLoading(false);
      return;
    }

    const { data, error: profilesError } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (profilesError) {
      setError(profilesError.message);
      setLoading(false);
      return;
    }

    setProfiles(data || []);
    setLoading(false);
  };

  if (loading) {
    return <div className="text-muted-foreground">Loading accounts...</div>;
  }

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold">Developer</h1>
        <p className="mt-4 text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold">Developer</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Signed in as {currentProfile?.email}
        </p>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-secondary text-muted-foreground">
            <tr>
              <th className="p-3">Email</th>
              <th className="p-3">Name</th>
              <th className="p-3">Business</th>
              <th className="p-3">Role</th>
              <th className="p-3">Created</th>
            </tr>
          </thead>

          <tbody>
            {profiles.map((profile) => (
              <tr key={profile.id} className="border-b last:border-0">
                <td className="p-3">{profile.email}</td>
                <td className="p-3">{profile.full_name || "-"}</td>
                <td className="p-3">{profile.business_name || "-"}</td>
                <td className="p-3">{profile.role}</td>
                <td className="p-3">
                  {profile.created_at
                    ? new Date(profile.created_at).toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
