
create type public.app_role as enum ('admin','user');
create type public.order_status as enum ('pending','paid','processing','sent','completed','cancelled');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  email text not null default '',
  created_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "own roles" on public.user_roles for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "own profile read" on public.profiles for select to authenticated using (id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "own profile update" on public.profiles for update to authenticated using (id = auth.uid());

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, email) values (new.id, coalesce(new.raw_user_meta_data->>'name',''), coalesce(new.email,''));
  insert into public.user_roles (user_id, role) values (new.id, 'user');
  -- first account becomes admin
  if (select count(*) from public.user_roles where role='admin') = 0 then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  end if;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  icon text not null default 'sparkles',
  sort int not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.categories to anon, authenticated;
grant insert, update, delete on public.categories to authenticated;
grant all on public.categories to service_role;
alter table public.categories enable row level security;
create policy "cat read" on public.categories for select to anon, authenticated using (true);
create policy "cat admin" on public.categories for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  price numeric(10,2) not null check (price >= 0),
  image_url text,
  category_id uuid references public.categories(id) on delete set null,
  active boolean not null default true,
  available boolean not null default true,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);
grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;
grant all on public.products to service_role;
alter table public.products enable row level security;
create policy "prod read" on public.products for select to anon, authenticated using (active or public.has_role(auth.uid(),'admin'));
create policy "prod admin" on public.products for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  percent int not null check (percent between 1 and 100),
  expires_at timestamptz,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.coupons to authenticated;
grant all on public.coupons to service_role;
alter table public.coupons enable row level security;
create policy "coupon admin" on public.coupons for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  number serial,
  user_id uuid not null,
  status order_status not null default 'pending',
  subtotal numeric(10,2) not null default 0,
  discount numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  coupon_code text,
  payment_status text not null default 'awaiting',
  delivery_status text not null default 'waiting',
  delivery_instructions text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, update on public.orders to authenticated;
grant all on public.orders to service_role;
alter table public.orders enable row level security;
create policy "order read" on public.orders for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "order admin update" on public.orders for update to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  unit_price numeric(10,2) not null,
  quantity int not null check (quantity > 0)
);
grant select on public.order_items to authenticated;
grant all on public.order_items to service_role;
alter table public.order_items enable row level security;
create policy "item read" on public.order_items for select to authenticated using (exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.has_role(auth.uid(),'admin'))));

create table public.order_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  kind text not null,
  message text not null,
  created_at timestamptz not null default now()
);
grant select, insert on public.order_events to authenticated;
grant all on public.order_events to service_role;
alter table public.order_events enable row level security;
create policy "event read" on public.order_events for select to authenticated using (exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.has_role(auth.uid(),'admin'))));
create policy "event admin insert" on public.order_events for insert to authenticated with check (public.has_role(auth.uid(),'admin'));

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  provider text not null,
  provider_ref text,
  amount numeric(10,2) not null,
  status text not null,
  raw jsonb,
  created_at timestamptz not null default now()
);
grant select on public.transactions to authenticated;
grant all on public.transactions to service_role;
alter table public.transactions enable row level security;
create policy "tx read" on public.transactions for select to authenticated using (exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.has_role(auth.uid(),'admin'))));

create table public.store_settings (
  id int primary key default 1 check (id = 1),
  store_name text not null default 'GLZADAS CHEATS',
  logo_url text,
  primary_color text not null default '#1e7bff',
  instagram text, youtube text, tiktok text, discord text,
  whatsapp text, email text,
  updated_at timestamptz not null default now()
);
grant select on public.store_settings to anon, authenticated;
grant update on public.store_settings to authenticated;
grant all on public.store_settings to service_role;
alter table public.store_settings enable row level security;
create policy "settings read" on public.store_settings for select to anon, authenticated using (true);
create policy "settings admin" on public.store_settings for update to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
insert into public.store_settings (id, discord, email) values (1, 'https://discord.gg/glzadas', 'contato@glzadas.com');

-- order creation computes prices server-side
create or replace function public.create_order(_items jsonb, _coupon text default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  _uid uuid := auth.uid();
  _order uuid;
  _sub numeric := 0;
  _pct int := 0;
  _it jsonb;
  _p record;
  _q int;
begin
  if _uid is null then raise exception 'not authenticated'; end if;
  if jsonb_array_length(_items) = 0 then raise exception 'empty cart'; end if;
  insert into orders (user_id) values (_uid) returning id into _order;
  for _it in select * from jsonb_array_elements(_items) loop
    _q := greatest(1, least(20, (_it->>'quantity')::int));
    select * into _p from products where id = (_it->>'product_id')::uuid and active and available;
    if not found then raise exception 'product unavailable'; end if;
    insert into order_items (order_id, product_id, product_name, unit_price, quantity) values (_order, _p.id, _p.name, _p.price, _q);
    _sub := _sub + _p.price * _q;
  end loop;
  if _coupon is not null and length(_coupon) > 0 then
    select percent into _pct from coupons where upper(code) = upper(_coupon) and active and (expires_at is null or expires_at > now());
    if not found then raise exception 'invalid coupon'; end if;
  end if;
  update orders set subtotal = _sub, discount = round(_sub * coalesce(_pct,0) / 100.0, 2),
    total = _sub - round(_sub * coalesce(_pct,0) / 100.0, 2),
    coupon_code = case when coalesce(_pct,0) > 0 then upper(_coupon) end
  where id = _order;
  insert into order_events (order_id, kind, message) values (_order, 'created', 'Pedido criado, aguardando pagamento');
  return _order;
end $$;
revoke execute on function public.create_order(jsonb, text) from anon, public;
grant execute on function public.create_order(jsonb, text) to authenticated;

create or replace function public.check_coupon(_code text) returns int language sql stable security definer set search_path = public as $$
  select percent from coupons where upper(code) = upper(_code) and active and (expires_at is null or expires_at > now())
$$;
grant execute on function public.check_coupon(text) to authenticated;

insert into public.categories (name, slug, icon, sort) values
 ('Artes & Logos','artes','palette',1),('Banners','banners','image',2),('Overlays & Stream','overlays','monitor',3),('Personalizações','personalizacoes','wand',4);

insert into public.products (name, slug, description, price, category_id, featured) values
 ('Logo Gamer Premium','logo-gamer-premium','Logo exclusiva para seu clã ou canal, com 3 revisões e arquivos em alta resolução.',89.90,(select id from categories where slug='artes'),true),
 ('Avatar Ilustrado','avatar-ilustrado','Avatar personalizado no estilo anime ou realista para perfis e redes sociais.',59.90,(select id from categories where slug='artes'),false),
 ('Banner YouTube + Twitch','banner-youtube-twitch','Kit de banners para canal com versões para YouTube, Twitch e Twitter.',49.90,(select id from categories where slug='banners'),true),
 ('Thumbnail Pack x5','thumbnail-pack','Cinco thumbnails chamativas para seus vídeos de gameplay.',69.90,(select id from categories where slug='banners'),false),
 ('Overlay Completo de Live','overlay-live','Overlay animado com tela de início, pausa, fim, alertas e painéis.',149.90,(select id from categories where slug='overlays'),true),
 ('Personalização de Perfil Discord','perfil-discord','Banner, avatar e emojis personalizados para seu servidor Discord.',79.90,(select id from categories where slug='personalizacoes'),true);
