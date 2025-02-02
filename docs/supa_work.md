# add constraints to the table.

```sql
ALTER TABLE user_roles
ADD CONSTRAINT scope_role_match CHECK (
    (scope = 'app' AND app_role IS NOT NULL AND organization_role IS NULL AND property_role IS NULL) OR
    (scope = 'organization' AND organization_role IS NOT NULL AND app_role IS NULL AND property_role IS NULL) OR
    (scope = 'property' AND property_role IS NOT NULL AND app_role IS NULL AND organization_role IS NULL)
);

Alter table user_roles 
ADD constraint scope_id_constraint check (
        (scope = 'app' and scope_id is null) or
        (scope != 'app' and scope_id is not null)
    ) 
```

## Create indices 

```sql
-- Create indices
create index idx_user_roles_user on public.user_roles(user_id);
create index idx_user_roles_scope on public.user_roles(scope);
create index idx_user_roles_scope_id on public.user_roles(scope_id);
create index idx_properties_organization on public.properties(organization_id);
```