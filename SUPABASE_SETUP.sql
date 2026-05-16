create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  business_id uuid null,
  name text not null,
  email text,
  phone text,
  status text default 'New Lead',
  tags text[] default '{}',
  notes text,
  follow_up_date date,
  follow_up_note text,
  archived boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  business_id uuid null,
  name text not null,
  category text default 'General',
  duration_minutes integer default 30,
  price numeric(10, 2) default 0,
  description text,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  business_id uuid null,
  customer_id uuid references customers(id) on delete set null,
  service_id uuid references services(id) on delete set null,
  user_id uuid null,
  date date not null,
  time text not null,
  status text default 'Scheduled',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table customers add column if not exists user_id uuid null;
alter table services add column if not exists user_id uuid null;
alter table bookings add column if not exists user_id uuid null;

create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_customers_updated_at on customers;
create trigger update_customers_updated_at
before update on customers
for each row
execute function update_updated_at_column();

drop trigger if exists update_services_updated_at on services;
create trigger update_services_updated_at
before update on services
for each row
execute function update_updated_at_column();

drop trigger if exists update_bookings_updated_at on bookings;
create trigger update_bookings_updated_at
before update on bookings
for each row
execute function update_updated_at_column();

alter table customers enable row level security;
alter table services enable row level security;
alter table bookings enable row level security;
alter table if exists profiles enable row level security;

/* Helper to verify the authenticated user is a developer */
create or replace function public.is_developer() returns boolean stable security definer language sql as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'developer');
$$;

drop policy if exists "Allow public customer read" on customers;
drop policy if exists "Allow public customer insert" on customers;
drop policy if exists "Allow public customer update" on customers;

create policy "Customer owner or developer select" on customers for select
using (
  auth.role() = 'authenticated' and (
    user_id = auth.uid() or public.is_developer()
  )
);

create policy "Customer owner or developer insert" on customers for insert
with check (
  auth.role() = 'authenticated' and (
    user_id = auth.uid() or public.is_developer()
  )
);

create policy "Customer owner or developer update" on customers for update
using (
  auth.role() = 'authenticated' and (
    user_id = auth.uid() or public.is_developer()
  )
)
with check (
  auth.role() = 'authenticated' and (
    user_id = auth.uid() or public.is_developer()
  )
);

drop policy if exists "Allow public service read" on services;
drop policy if exists "Allow public service insert" on services;
drop policy if exists "Allow public service update" on services;

create policy "Service owner or developer select" on services for select
using (
  auth.role() = 'authenticated' and (
    user_id = auth.uid() or public.is_developer()
  )
);

create policy "Service owner or developer insert" on services for insert
with check (
  auth.role() = 'authenticated' and (
    user_id = auth.uid() or public.is_developer()
  )
);

create policy "Service owner or developer update" on services for update
using (
  auth.role() = 'authenticated' and (
    user_id = auth.uid() or public.is_developer()
  )
)
with check (
  auth.role() = 'authenticated' and (
    user_id = auth.uid() or public.is_developer()
  )
);

drop policy if exists "Allow public booking read" on bookings;
drop policy if exists "Allow public booking insert" on bookings;
drop policy if exists "Allow public booking update" on bookings;

create policy "Booking owner or developer select" on bookings for select
using (
  auth.role() = 'authenticated' and (
    user_id = auth.uid() or public.is_developer()
  )
);

create policy "Booking owner or developer insert" on bookings for insert
with check (
  auth.role() = 'authenticated' and (
    user_id = auth.uid() or public.is_developer()
  )
);

create policy "Booking owner or developer update" on bookings for update
using (
  auth.role() = 'authenticated' and (
    user_id = auth.uid() or public.is_developer()
  )
)
with check (
  auth.role() = 'authenticated' and (
    user_id = auth.uid() or public.is_developer()
  )
);

drop policy if exists "Profile self or developer select" on profiles;
create policy "Profile self or developer select" on profiles for select
using (
  id = auth.uid() or public.is_developer()
);
