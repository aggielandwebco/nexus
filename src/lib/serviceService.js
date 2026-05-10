import { supabase } from "@/lib/supabaseClient";

function cleanServiceData(serviceData) {
  return {
    name: serviceData.name?.trim(),
    category: serviceData.category?.trim() || "General",
    duration_minutes: Number(serviceData.duration_minutes) || 30,
    price: Number(serviceData.price) || 0,
    description: serviceData.description?.trim() || null,
    active: serviceData.active ?? true
  };
}

export async function getServices({ active = true } = {}) {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("active", active)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createService(serviceData) {
  const { data, error } = await supabase
    .from("services")
    .insert([cleanServiceData(serviceData)])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateService(id, updates) {
  const { data, error } = await supabase
    .from("services")
    .update(cleanServiceData(updates))
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deactivateService(id) {
  const { data, error } = await supabase
    .from("services")
    .update({ active: false })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function restoreService(id) {
  const { data, error } = await supabase
    .from("services")
    .update({ active: true })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
