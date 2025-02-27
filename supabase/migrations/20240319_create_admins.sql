-- Create admins table
create table public.admins (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  email text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.admins enable row level security;

-- Create policies
create policy "Admins are viewable by authenticated users"
  on public.admins
  for select
  to authenticated
  using (true);

create policy "Admins can only be inserted by admins"
  on public.admins
  for insert
  to authenticated
  using (
    exists (
      select 1 from public.admins where user_id = auth.uid()
    )
  );

-- Create indexes
create index admins_user_id_idx on public.admins(user_id);
create index admins_email_idx on public.admins(email);

-- Create function to update updated_at
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- Create trigger for updated_at
create trigger handle_admins_updated_at
  before update on public.admins
  for each row
  execute function public.handle_updated_at(); 