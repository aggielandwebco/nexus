import { supabase } from "@/lib/supabaseClient";

function cleanCustomerData(customerData) {
  return {
    business_id: customerData.business_id || null,
    user_id: customerData.user_id || null,
    name: customerData.name?.trim(),
    email: customerData.email?.trim() || null,
    phone: customerData.phone?.trim() || null,
    status: customerData.status || "New Lead",
    tags: Array.isArray(customerData.tags) ? customerData.tags : [],
    notes: customerData.notes?.trim() || null,
    follow_up_date: customerData.follow_up_date || null,
    follow_up_note: customerData.follow_up_note?.trim() || null
  };
}

export async function getCustomers({ archived = false } = {}) {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("archived", archived)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createCustomer(customerData) {
  const payload = cleanCustomerData(customerData);
  const insertPayload = Object.fromEntries(Object.entries(payload).filter(([, v]) => v !== null && v !== undefined));

  const { data, error } = await supabase
    .from("customers")
    .insert([insertPayload])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCustomer(id, updates) {
  const payload = {};
  if (Object.prototype.hasOwnProperty.call(updates, "business_id")) payload.business_id = updates.business_id;
  if (Object.prototype.hasOwnProperty.call(updates, "user_id")) payload.user_id = updates.user_id;
  if (Object.prototype.hasOwnProperty.call(updates, "name")) payload.name = updates.name?.trim();
  if (Object.prototype.hasOwnProperty.call(updates, "email")) payload.email = updates.email?.trim() || null;
  if (Object.prototype.hasOwnProperty.call(updates, "phone")) payload.phone = updates.phone?.trim() || null;
  if (Object.prototype.hasOwnProperty.call(updates, "status")) payload.status = updates.status;
  if (Object.prototype.hasOwnProperty.call(updates, "tags")) payload.tags = Array.isArray(updates.tags) ? updates.tags : [];
  if (Object.prototype.hasOwnProperty.call(updates, "notes")) payload.notes = updates.notes?.trim() || null;
  if (Object.prototype.hasOwnProperty.call(updates, "follow_up_date")) payload.follow_up_date = updates.follow_up_date || null;
  if (Object.prototype.hasOwnProperty.call(updates, "follow_up_note")) payload.follow_up_note = updates.follow_up_note?.trim() || null;

  const { data, error } = await supabase
    .from("customers")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function archiveCustomer(id) {
  const { data, error } = await supabase
    .from("customers")
    .update({ archived: true })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function restoreCustomer(id) {
  const { data, error } = await supabase
    .from("customers")
    .update({ archived: false })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}