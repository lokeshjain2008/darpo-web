## Learning about Supabase

### Exporting Database Schema

To export the current database schema from Supabase and add it to the Git repository, follow these steps:

1. **Install Supabase CLI:**
   ```sh
   npm install -g supabase
   ```

2. **Login to Supabase:**
   ```sh
   supabase login
   ```

3. **Initialize Supabase Project:**

```sh
cd /path/to/your/project
supabase init
# this will create setup to run it locally, this will require docker to be on
# later you can manage the local by 
supabse start
supbase stop
# once you have made changes you can push to the project on supabse platform
```

3.1. **link supabse project**

```sh
supabse link <project-ref-id>
```

3.2 **Update supabase project with changes**
```sh
supabase db push
```

### starting connect to the remote from local
4. **Generate Database Schema:**
```sh
# if starting fresh on local but remote has schema
supabase db dump
# else 
supabase db pull
supabase db diff
```
4.1 if not running local setup then use

```sh
supabase migrations fetch  
# list , repair, squash(will use), up(local setup)
# Note: this will only keep track of migrations run on the db.it won't fetch the up to date schema.
```


5. **Add Schema to Git:**
```sh
git add supabase/schema.sql
git commit -m "Add current database schema"
git push
```


"supabase:types": "supabase generate-types --schema public --db-url $SUPABASE_URL --db-key $SUPABASE_KEY",

### [login issue on the vercel](https://stackoverflow.com/a/79369589/1457016)
1. [Login for react app](https://supabase.com/docs/guides/auth/quickstarts/react)
2. [Auth| YT playlist](https://www.youtube.com/watch?v=v3Exg5YpJvE&list=PL5S4mPUpp4OvE6MLbO1xAMvKLKT1sFsHF)
3. [RLS policies|YT](https://www.youtube.com/watch?v=hu2SQjvCXIw)
4. [Postgres fn](https://www.youtube.com/watch?v=MJZCCpCYEqk)

## Auth functions 
1. we are creating and function which will check the permission for the given org_id,
we have enhanced to check for multiple role_names on the given scope(app/property)

```sql

create or replace function public.has_role(
    check_user_id uuid,
    check_scope scope_type,
    check_scope_id uuid default null,
    app_roles app_role_type[] default null,
    org_roles organization_role_type[] default null,
    prop_roles property_role_type[] default null
) returns boolean
language sql security definer as $$
    select exists (
        select 1 from public.user_roles
        where user_id = check_user_id
        and scope = check_scope
        and (
            (check_scope = 'app' and app_role = any($4)) or
            (check_scope = 'organization' and organization_role = any($5)) or
            (check_scope = 'property' and property_role = any($6))
        )
        and (
            (check_scope = 'app' and scope_id is null) or
            (check_scope != 'app' and scope_id = check_scope_id)
        )
    );
$$;


---------- Better version using the variable names-----

create or replace function public.has_role(
    check_user_id uuid,
    check_scope scope_type,
    check_scope_id uuid default null,
    check_app_roles app_role_type[] default null,
    check_org_roles organization_role_type[] default null,
    check_prop_roles property_role_type[] default null
)
returns boolean
language plpgsql security definer as
$$
declare
    has_required_role boolean;
begin
    select exists (
        select 1 
        from public.user_roles ur
        where ur.user_id = check_user_id
        and ur.scope = check_scope
        and (
            (check_scope = 'app' and ur.app_role = any(check_app_roles)) or
            (check_scope = 'organization' and ur.organization_role = any(check_org_roles)) or
            (check_scope = 'property' and ur.property_role = any(check_prop_roles))
        )
        and (
            (check_scope = 'app' and ur.scope_id is null) or
            (check_scope != 'app' and ur.scope_id = check_scope_id)
        )
    ) into has_required_role;

    return has_required_role;
end;
$$;


```

Example usage `type cast for enum types`

```sql

create policy "Organization admins or owners can view profiles"
    on public.profiles
    for select
    using (
        public.has_role(
            auth.uid(),
            'organization'::role_scope_type,
            -- read more about get_curr_org fn
            public.get_current_organization(),
            null,
            array['admin', 'owner']::organization_role_type[],
            null
        )
    );

```

### How do we get the current context for the user

```sql

-- Create organization context table
create table public.user_organization_context (
    user_id uuid references public.profiles(id) on delete cascade,
    current_organization_id uuid references public.organizations(id) on delete cascade,
    updated_at timestamptz default now(),
    primary key (user_id),
    constraint valid_organization check (
        exists (
            select 1 from public.user_roles 
            where user_id = user_organization_context.user_id 
            and scope = 'organization' 
            and scope_id = current_organization_id
        )
    )
);

-- Function to switch organization context
create or replace function public.switch_organization(org_id uuid)
returns void
language plpgsql security definer as $$
begin
    -- Verify user has access to organization
    if not public.has_role(
        auth.uid(),
        'organization'::scope_type,
        org_id,
        null,
        'admin'::organization_role_type,
        null
    ) then
        raise exception 'Not authorized for this organization';
    end if;

    -- Update or insert context
    insert into public.user_organization_context (user_id, current_organization_id)
    values (auth.uid(), org_id)
    on conflict (user_id) 
    do update set 
        current_organization_id = excluded.current_organization_id,
        updated_at = now();
end; $$;

-- Function to get current organization context
create or replace function public.get_current_organization()
returns uuid
language sql security definer as $$
    select current_organization_id 
    from public.user_organization_context 
    where user_id = auth.uid();
$$;

-- Update profiles policy to use organization context
create policy "Organization admins can view related profiles"
    on public.profiles
    for select
    using (
        exists (
            select 1 
            from public.user_roles admin_org
            where public.has_role(
                auth.uid(),
                'organization'::scope_type,
                public.get_current_organization(),
                null,
                'admin'::organization_role_type,
                null
            )
            and exists (
                select 1 
                from public.user_roles member_roles
                where member_roles.user_id = profiles.id
                and (
                    (member_roles.scope = 'organization' 
                     and member_roles.scope_id = public.get_current_organization())
                    or 
                    (member_roles.scope = 'property' 
                     and exists (
                        select 1 
                        from public.properties p
                        where p.id = member_roles.scope_id
                        and p.organization_id = public.get_current_organization()
                    ))
                )
            )
        )
    );

```



