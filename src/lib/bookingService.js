import { supabase } from "@/lib/supabaseClient";

function cleanBookingData(bookingData) {
  return {
    customer_id: bookingData.customer_id || null,
    service_id: bookingData.service_id || null,
    date: bookingData.date,
    time: bookingData.time,
    status: bookingData.status || "Scheduled",
    notes: bookingData.notes?.trim() || null
  };
}

export async function getBookings() {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("date", { ascending: true })
    .order("time", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function createBooking(bookingData) {
  const { data, error } = await supabase
    .from("bookings")
    .insert([cleanBookingData(bookingData)])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateBooking(id, updates) {
  const { data, error } = await supabase
    .from("bookings")
    .update(cleanBookingData(updates))
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function cancelBooking(id) {
  const { data, error } = await supabase
    .from("bookings")
    .update({ status: "Cancelled" })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
