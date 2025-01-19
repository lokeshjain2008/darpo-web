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

5. **Add Schema to Git:**
```sh
git add supabase/schema.sql
git commit -m "Add current database schema"
git push
```

"supabase:types": "supabase generate-types --schema public --db-url $SUPABASE_URL --db-key $SUPABASE_KEY",
