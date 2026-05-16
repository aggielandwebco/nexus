import { supabase } from "@/lib/supabaseClient";

function cleanCustomerData(customerData) {
  return {
    business_id: customerData.business_id || null,
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
  const { data, error } = await supabase
    .from("customers")
    .insert([cleanCustomerData(customerData)])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCustomer(id, updates) {
  const { data, error } = await supabase
    .from("customers")
    .update(cleanCustomerData(updates))
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