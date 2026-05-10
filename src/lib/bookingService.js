import { supabase } from "@/lib/supabaseClient";

function cleanBookingData(bookingData) {
  return {
    customer_id: bookingData.customer_id || null,
    service_id: bookingData.service_id || null,
    business_id: bookingData.business_id || null,
    date: bookingData.date || null,
    time: bookingData.time || null,
    status: bookingData.status || "Scheduled",
    notes: bookingData.notes?.trim() || null,
    archived: bookingData.archived ?? false
  };
}

export async function getBookings() {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("archived", false)
    .order("date", { ascending: true })
    .order("time", { ascending: true });

  if (error) {
    console.error("getBookings error:", error);
    throw error;
  }

  return data || [];
}

export async function createBooking(bookingData) {
  const payload = cleanBookingData(bookingData);

  const { data, error } = await supabase
    .from("bookings")
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error("createBooking error:", error);
    console.error("createBooking payload:", payload);
    throw error;
  }

  return data;
}

export async function updateBooking(id, updates) {
  const payload = cleanBookingData(updates);

  const { data, error } = await supabase
    .from("bookings")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("updateBooking error:", error);
    console.error("updateBooking payload:", payload);
    throw error;
  }

  return data;
}

export async function cancelBooking(id) {
  const { data, error } = await supabase
    .from("bookings")
    .update({ status: "Cancelled" })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("cancelBooking error:", error);
    throw error;
  }

  return data;
}

export async function archiveBooking(id) {
  const { data, error } = await supabase
    .from("bookings")
    .update({ archived: true })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("archiveBooking error:", error);
    throw error;
  }

  return data;
}