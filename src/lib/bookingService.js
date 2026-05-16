import { supabase } from "@/lib/supabaseClient";

function cleanBookingData(bookingData) {
  return {
    customer_id: bookingData.customer_id || null,
    service_id: bookingData.service_id || null,
    business_id: bookingData.business_id || null,
    user_id: bookingData.user_id || null,
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

  // Validate required fields before sending to Supabase to avoid DB constraint errors
  if (!payload.date || !payload.time) {
    throw new Error("Booking must include a date and time.");
  }

  // Remove null/undefined fields before inserting
  const insertPayload = Object.fromEntries(Object.entries(payload).filter(([, v]) => v !== null && v !== undefined));

  const { data, error } = await supabase
    .from("bookings")
    .insert(insertPayload)
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
  // Build a partial payload for updates so we don't overwrite unspecified fields with null/defaults
  const payload = {};
  if (Object.prototype.hasOwnProperty.call(updates, "customer_id")) payload.customer_id = updates.customer_id;
  if (Object.prototype.hasOwnProperty.call(updates, "service_id")) payload.service_id = updates.service_id;
  if (Object.prototype.hasOwnProperty.call(updates, "business_id")) payload.business_id = updates.business_id;
  if (Object.prototype.hasOwnProperty.call(updates, "date")) payload.date = updates.date;
  if (Object.prototype.hasOwnProperty.call(updates, "time")) payload.time = updates.time;
  if (Object.prototype.hasOwnProperty.call(updates, "status")) payload.status = updates.status;
  if (Object.prototype.hasOwnProperty.call(updates, "notes")) payload.notes = updates.notes;
  if (Object.prototype.hasOwnProperty.call(updates, "archived")) payload.archived = updates.archived;

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