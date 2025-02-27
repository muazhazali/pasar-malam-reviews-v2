-- Create shops table
create table public.shops (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  category text not null,
  coordinates point not null,
  address text not null,
  operating_hours text,
  phone text,
  website text,
  verified boolean default false,
  photos text[],
  rating numeric(3,2) default 0,
  review_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create reviews table
create table public.reviews (
  id uuid default uuid_generate_v4() primary key,
  shop_id uuid references public.shops(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  content text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  upvotes integer default 0,
  downvotes integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create review_votes table for tracking user votes
create table public.review_votes (
  id uuid default uuid_generate_v4() primary key,
  review_id uuid references public.reviews(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  vote_type text not null check (vote_type in ('up', 'down')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(review_id, user_id)
);

-- Enable RLS
alter table public.shops enable row level security;
alter table public.reviews enable row level security;
alter table public.review_votes enable row level security;

-- Shops policies
create policy "Shops are viewable by everyone"
  on public.shops
  for select
  using (true);

create policy "Shops can only be inserted by admins"
  on public.shops
  for insert
  to authenticated
  using (
    exists (
      select 1 from public.admins where user_id = auth.uid()
    )
  );

create policy "Shops can only be updated by admins"
  on public.shops
  for update
  to authenticated
  using (
    exists (
      select 1 from public.admins where user_id = auth.uid()
    )
  );

-- Reviews policies
create policy "Reviews are viewable by everyone"
  on public.reviews
  for select
  using (true);

create policy "Reviews can be created by authenticated users"
  on public.reviews
  for insert
  to authenticated
  using (auth.uid() = user_id);

create policy "Reviews can be updated by their authors"
  on public.reviews
  for update
  to authenticated
  using (auth.uid() = user_id);

-- Review votes policies
create policy "Review votes are viewable by everyone"
  on public.review_votes
  for select
  using (true);

create policy "Review votes can be created by authenticated users"
  on public.review_votes
  for insert
  to authenticated
  using (auth.uid() = user_id);

create policy "Review votes can be updated by their authors"
  on public.review_votes
  for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Review votes can be deleted by their authors"
  on public.review_votes
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- Create indexes
create index shops_category_idx on public.shops(category);
create index shops_coordinates_idx on public.shops using gist(coordinates);
create index reviews_shop_id_idx on public.reviews(shop_id);
create index reviews_user_id_idx on public.reviews(user_id);
create index reviews_status_idx on public.reviews(status);
create index review_votes_review_id_idx on public.review_votes(review_id);
create index review_votes_user_id_idx on public.review_votes(user_id);

-- Create function to update shop rating and review count
create or replace function public.update_shop_rating()
returns trigger
language plpgsql
as $$
begin
  if (TG_OP = 'INSERT' and NEW.status = 'approved') or
     (TG_OP = 'UPDATE' and OLD.status != 'approved' and NEW.status = 'approved') then
    -- Increment review count and update rating
    update public.shops
    set review_count = review_count + 1,
        rating = (
          select round(avg(rating)::numeric, 2)
          from public.reviews
          where shop_id = NEW.shop_id
          and status = 'approved'
        )
    where id = NEW.shop_id;
  elsif (TG_OP = 'DELETE' and OLD.status = 'approved') or
        (TG_OP = 'UPDATE' and OLD.status = 'approved' and NEW.status != 'approved') then
    -- Decrement review count and update rating
    update public.shops
    set review_count = greatest(0, review_count - 1),
        rating = coalesce(
          (
            select round(avg(rating)::numeric, 2)
            from public.reviews
            where shop_id = OLD.shop_id
            and status = 'approved'
          ),
          0
        )
    where id = OLD.shop_id;
  end if;
  return NEW;
end;
$$;

-- Create function to update review vote counts
create or replace function public.update_review_votes()
returns trigger
language plpgsql
as $$
begin
  if (TG_OP = 'INSERT') then
    update public.reviews
    set upvotes = case when NEW.vote_type = 'up' then upvotes + 1 else upvotes end,
        downvotes = case when NEW.vote_type = 'down' then downvotes + 1 else downvotes end
    where id = NEW.review_id;
  elsif (TG_OP = 'DELETE') then
    update public.reviews
    set upvotes = case when OLD.vote_type = 'up' then greatest(0, upvotes - 1) else upvotes end,
        downvotes = case when OLD.vote_type = 'down' then greatest(0, downvotes - 1) else downvotes end
    where id = OLD.review_id;
  elsif (TG_OP = 'UPDATE' and OLD.vote_type != NEW.vote_type) then
    update public.reviews
    set upvotes = case
          when OLD.vote_type = 'up' then greatest(0, upvotes - 1)
          when NEW.vote_type = 'up' then upvotes + 1
          else upvotes
        end,
        downvotes = case
          when OLD.vote_type = 'down' then greatest(0, downvotes - 1)
          when NEW.vote_type = 'down' then downvotes + 1
          else downvotes
        end
    where id = NEW.review_id;
  end if;
  return NEW;
end;
$$;

-- Create triggers
create trigger handle_shop_updated_at
  before update on public.shops
  for each row
  execute function public.handle_updated_at();

create trigger handle_review_updated_at
  before update on public.reviews
  for each row
  execute function public.handle_updated_at();

create trigger update_shop_rating
  after insert or update or delete on public.reviews
  for each row
  execute function public.update_shop_rating();

create trigger update_review_votes
  after insert or update or delete on public.review_votes
  for each row
  execute function public.update_review_votes(); 