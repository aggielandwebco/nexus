import { supabase } from "@/lib/supabaseClient";

export async function getAuthUser() {
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error) throw error;
  if (!user) throw new Error("Authentication required.");

  return user;
}

export async function getCurrentProfile() {
  const user = await getAuthUser();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error) throw error;
  return { user, profile };
}

export async function getAuthenticatedUserId() {
  const user = await getAuthUser();
  return user.id;
}

export async function userIsDeveloper() {
  const { profile } = await getCurrentProfile();
  return profile?.role === "developer";
}
