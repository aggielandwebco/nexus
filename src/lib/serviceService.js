import { supabase } from "@/lib/supabaseClient";

function cleanServiceData(serviceData) {
  return {
    business_id: serviceData.business_id || null,
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
  // Build a partial payload for updates so we don't overwrite unspecified fields
  const payload = {};
  if (Object.prototype.hasOwnProperty.call(updates, "name")) payload.name = updates.name?.trim() || "";
  if (Object.prototype.hasOwnProperty.call(updates, "category")) payload.category = updates.category?.trim() || "General";
  if (Object.prototype.hasOwnProperty.call(updates, "duration_minutes")) payload.duration_minutes = Number(updates.duration_minutes) || 30;
  if (Object.prototype.hasOwnProperty.call(updates, "price")) payload.price = Number(updates.price) || 0;
  if (Object.prototype.hasOwnProperty.call(updates, "description")) payload.description = updates.description?.trim() || null;
  if (Object.prototype.hasOwnProperty.call(updates, "active")) payload.active = updates.active;

  // If the update includes a name, ensure it's not empty
  if (Object.prototype.hasOwnProperty.call(payload, "name") && !payload.name) {
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