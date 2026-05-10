import { supabase } from "@/lib/supabaseClient";

function cleanServiceData(serviceData) {
  return {
    name: serviceData.name?.trim() || "",
    category: serviceData.category?.trim() || "General",
    duration_minutes: Number(serviceData.duration_minutes) || 30,
    price: Number(serviceData.price) || 0,
    description: serviceData.description?.trim() || null,
    active: serviceData.active ?? true
  };
}

export async function getServices({ active = true } = {}) {
  const query = supabase
    .from("services")
    .select("*")
    .order("created_at", { ascending: false });

  if (active !== "all") {
    query.eq("active", active);
  }

  const { data, error } = await query;

  if (error) {
    console.error("getServices error:", error);
    throw error;
  }

  return data || [];
}

export async function createService(serviceData) {
  const payload = cleanServiceData(serviceData);

  if (!payload.name) {
    throw new Error("Service name is required.");
  }

  const { data, error } = await supabase
    .from("services")
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error("createService error:", error);
    console.error("createService payload:", payload);
    throw error;
  }

  return data;
}

export async function updateService(id, updates) {
  const payload = cleanServiceData(updates);

  if (!payload.name) {
    throw new Error("Service name is required.");
  }

  const { data, error } = await supabase
    .from("services")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("updateService error:", error);
    console.error("updateService payload:", payload);
    throw error;
  }

  return data;
}

export async function deactivateService(id) {
  const { data, error } = await supabase
    .from("services")
    .update({ active: false })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("deactivateService error:", error);
    throw error;
  }

  return data;
}

export async function restoreService(id) {
  const { data, error } = await supabase
    .from("services")
    .update({ active: true })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("restoreService error:", error);
    throw error;
  }

  return data;
}