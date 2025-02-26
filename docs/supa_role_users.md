1. First, create a helper function to check role hierarchy:

```sql
-- Function to get role hierarchy level
create or replace function get_role_level(
  scope role_scope_type,
  app_role app_role_type = null,
  org_role organization_role_type = null,
  prop_role property_role_type = null
) returns integer as $$
begin
  -- App role hierarchy
  if scope = 'app' then
    return case app_role
      when 'god' then 1
      when 'admin' then 2
      when 'support' then 3
      else null
    end;
  
  -- Organization role hierarchy
  elsif scope = 'organization' then
    return case org_role
      when 'owner' then 11
      when 'admin' then 12
      when 'manager' then 13
      else null
    end;
  
  -- Property role hierarchy
  elsif scope = 'property' then
    return case prop_role
      when 'manager' then 21
      when 'desk' then 22
      when 'reader' then 23
      else null
    end;
  end if;
  
  return null;
end;
$$ language plpgsql security definer;

-- Function to check if user can grant role
create or replace function can_grant_role(
  granter_id uuid,
  scope role_scope_type,
  app_role app_role_type = null,
  org_role organization_role_type = null,
  prop_role property_role_type = null,
  org_id uuid = null,
  prop_id uuid = null
) returns boolean as $$
declare
  granter_role record;
  granter_level integer;
  grant_level integer;
begin
  -- Get granter's highest role for the scope
  select * from user_roles
  where user_id = granter_id
  and (
    (scope = 'app') or
    (scope = 'organization' and scope_id = org_id) or
    (scope = 'property' and scope_id = prop_id)
  )
  order by scope limit 1 -- app > organization > property
  into granter_role;

  -- Get hierarchy levels
  granter_level := get_role_level(
    granter_role.scope,
    granter_role.app_role,
    granter_role.organization_role,
    granter_role.property_role
  );
  
  grant_level := get_role_level(scope, app_role, org_role, prop_role);

  -- Rules:
  -- 1. Can't grant role at higher scope than own role
  -- 2. Can't grant role at same or higher level than own role
  -- 3. Can only grant roles within own organization/property
  return 
    granter_level is not null and
    grant_level is not null and
    granter_level < grant_level and
    (
      scope = granter_role.scope or
      (granter_role.scope = 'app') or
      (granter_role.scope = 'organization' and scope = 'property' and 
       exists(select 1 from properties where id = prop_id and organization_id = granter_role.scope_id))
    );
end;
$$ language plpgsql security definer;


```

2. create RLS


```sql

-- RLS policy for inserting roles
create policy "Users can grant roles based on their own role level"
  on user_roles
  for insert
  with check (
    can_grant_role(
      auth.uid(),
      scope,
      app_role,
      organization_role,
      property_role,
      case when scope = 'organization' then scope_id else null end,
      case when scope = 'property' then scope_id else null end
    )
  );

  ```

  3. Add trigger to prevent role elevation:

  ```sql
    create or replace function prevent_role_elevation()
  returns trigger as $$
  begin
    -- Prevent users from elevating their own role
    if NEW.user_id = auth.uid() then
      raise exception 'Users cannot modify their own roles';
    end if;
  
    return NEW;
  end;
  $$ language plpgsql security definer;
  
  create trigger check_role_elevation
    before insert or update
    on user_roles
    for each row
    execute function prevent_role_elevation();

    ```







===================================

```sql

-- Modify can_grant_role to handle updates
create or replace function can_grant_role(
  granter_id uuid,
  scope role_scope_type,
  app_role app_role_type = null,
  org_role organization_role_type = null,
  prop_role property_role_type = null,
  org_id uuid = null,
  prop_id uuid = null,
  is_update boolean = false,
  old_role_id uuid = null
) returns boolean as $$
declare
  granter_role record;
  target_existing_role record;
  granter_level role_hierarchy_level;
  grant_level role_hierarchy_level;
begin
  -- For updates, check if user has permission to modify existing role
  if is_update then
    select * from user_roles where id = old_role_id into target_existing_role;
    if not found then
      return false;
    end if;
    
    -- Cannot modify roles in higher scope
    if target_existing_role.scope = 'app' and not exists (
      select 1 from user_roles 
      where user_id = granter_id 
      and scope = 'app'
      and app_role = 'god'
    ) then
      return false;
    end if;
  end if;

  -- Rest of the existing logic
  select * from user_roles
  where user_id = granter_id
  and (
    (scope = 'app') or
    (scope = 'organization' and scope_id = org_id) or
    (scope = 'property' and scope_id = prop_id)
  )
  order by scope limit 1
  into granter_role;

  granter_level := get_role_level(
    granter_role.scope,
    granter_role.app_role,
    granter_role.organization_role,
    granter_role.property_role
  );
  
  grant_level := get_role_level(scope, app_role, org_role, prop_role);

  return 
    granter_level is not null and
    grant_level is not null and
    granter_level < grant_level and
    (
      scope = granter_role.scope or
      (granter_role.scope = 'app') or
      (granter_role.scope = 'organization' and scope = 'property' and 
       exists(select 1 from properties where id = prop_id and organization_id = granter_role.scope_id))
    );
end;
$$ language plpgsql security definer;

-- Update RLS policies to handle both insert and update
create policy "Users can grant roles based on their own role level"
  on user_roles
  for insert
  with check (
    can_grant_role(
      auth.uid(),
      scope,
      app_role,
      organization_role,
      property_role,
      case when scope = 'organization' then scope_id else null end,
      case when scope = 'property' then scope_id else null end,
      false,
      null
    )
  );

create policy "Users can update roles based on their own role level"
  on user_roles
  for update
  using (
    can_grant_role(
      auth.uid(),
      scope,
      app_role,
      organization_role,
      property_role,
      case when scope = 'organization' then scope_id else null end,
      case when scope = 'property' then scope_id else null end,
      true,
      id
    )
  );

-- Modify trigger to handle updates
create or replace function prevent_role_elevation()
returns trigger as $$
begin
  -- Prevent users from modifying their own role
  if NEW.user_id = auth.uid() then
    raise exception 'Users cannot modify their own roles';
  end if;

  -- For updates, ensure role level isn't being elevated
  if TG_OP = 'UPDATE' then
    if get_role_level(NEW.scope, NEW.app_role, NEW.organization_role, NEW.property_role) <
       get_role_level(OLD.scope, OLD.app_role, OLD.organization_role, OLD.property_role) then
      raise exception 'Cannot elevate role level';
    end if;
  end if;

  return NEW;
end;
$$ language plpgsql security definer;


```


