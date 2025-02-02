-- Enable UUID extension
create extension if not exists "uuid-ossp";
-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  phone_number text unique,
  is_phone_verified boolean default false,
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  created_at timestamp with time zone default timezone('utc'::text, now())
);
-- Create organizations table
create table public.organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
-- Create roles table
create table public.roles (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  organization_id uuid references public.organizations(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
-- Create permissions table
create table public.permissions (
  id uuid primary key default uuid_generate_v4(),
  action text not null,
  entity_type text not null,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(action, entity_type)
);
-- Create permission_role junction table
create table public.permission_role (
  role_id uuid references public.roles(id) on delete cascade,
  permission_id uuid references public.permissions(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (role_id, permission_id)
);
-- Create user_organization_role junction table
create table public.user_organization_role (
  user_id uuid references public.profiles(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete cascade,
  role_id uuid references public.roles(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, organization_id, role_id)
);
-- Create user_app_role junction table
create table public.user_app_role (
  user_id uuid references public.profiles(id) on delete cascade,
  role_id uuid references public.roles(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, role_id)
);
-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.permission_role enable row level security;
alter table public.user_organization_role enable row level security;
alter table public.user_app_role enable row level security;
-- Create RLS Policies

-- Profiles policies
create policy "Users can view own profile"
  on public.profiles for select
  using ( auth.uid() = id );
create policy "Users can insert own profile"
  on public.profiles for insert
  with check ( auth.uid() = id );
create policy "Users can update own profile"
  on public.profiles for update
  using ( auth.uid() = id );
-- Helper function for checking permissions
create or replace function public.has_permission(
  check_user_id uuid,
  required_action text,
  entity_type text,
  organization_id uuid default null
) returns boolean as $$
declare
  has_perm boolean;
begin
  -- Check app-level permissions first
  select exists (
    select 1
    from public.user_app_role uar
    join public.permission_role pr on pr.role_id = uar.role_id
    join public.permissions p on p.id = pr.permission_id
    where uar.user_id = check_user_id
    and p.action = required_action
    and p.entity_type = entity_type
  ) into has_perm;
  
  if has_perm then
    return true;
  end if;

  -- Check organization-level permissions
  if organization_id is not null then
    select exists (
      select 1
      from public.user_organization_role uor
      join public.permission_role pr on pr.role_id = uor.role_id
      join public.permissions p on p.id = pr.permission_id
      where uor.user_id = check_user_id
      and uor.organization_id = organization_id
      and p.action = required_action
      and p.entity_type = entity_type
    ) into has_perm;
    
    return has_perm;
  end if;

  return false;
end;
$$ language plpgsql security definer;
-- Handle new user creation
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$;
-- Create trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
-- Create indices for performance
create index idx_profiles_phone on public.profiles(phone_number);
create index idx_organizations_name on public.organizations(name);
create index idx_roles_name on public.roles(name);
create index idx_roles_org on public.roles(organization_id);
create index idx_permissions_action_entity on public.permissions(action, entity_type);
