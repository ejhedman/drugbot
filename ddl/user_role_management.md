# User Role Management for Drug Database

## User Roles

### **readonly** (Default)
- Can read all data in the database
- Cannot create, update, or delete any records
- Automatically assigned to new users

### **data_editor**
- Can read all data in the database
- Can create, update, and delete all records
- Can view list of users and their roles

## Setting Up User Roles

### 1. Server-Side User Role Management (Next.js API Route)

Create `pages/api/admin/set-user-role.ts`:

```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })
  
  // Check if current user is data_editor
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const currentUserRole = user.user_metadata?.role || 'readonly'
  if (currentUserRole !== 'data_editor') {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 })
  }
  
  const { userId, role } = await request.json()
  
  if (!['readonly', 'data_editor'].includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
  }
  
  // Use service role client to update user metadata
  const serviceSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // Service role key
  )
  
  const { error } = await serviceSupabase.rpc('set_user_role', {
    user_id: userId,
    new_role: role
  })
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ success: true })
}
```

### 2. Client-Side User Management Component

```typescript
'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface User {
  user_id: string
  email: string
  role: string
  created_at: string
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()
  
  useEffect(() => {
    fetchUsers()
  }, [])
  
  const fetchUsers = async () => {
    const { data, error } = await supabase.rpc('get_users_with_roles')
    if (data) setUsers(data)
    setLoading(false)
  }
  
  const updateUserRole = async (userId: string, newRole: string) => {
    const response = await fetch('/api/admin/set-user-role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, role: newRole })
    })
    
    if (response.ok) {
      fetchUsers() // Refresh the list
    }
  }
  
  if (loading) return <div>Loading...</div>
  
  return (
    <div>
      <h2>User Role Management</h2>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Current Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.user_id}>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <select 
                  value={user.role}
                  onChange={(e) => updateUserRole(user.user_id, e.target.value)}
                >
                  <option value="readonly">Read Only</option>
                  <option value="data_editor">Data Editor</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

### 3. Direct Database Role Assignment (SQL)

To manually set a user's role via SQL:

```sql
-- Set a user as data_editor
SELECT set_user_role('user-uuid-here', 'data_editor');

-- Set a user as readonly
SELECT set_user_role('user-uuid-here', 'readonly');

-- View all users and their roles
SELECT * FROM get_users_with_roles();
```

### 4. First Data Editor Setup

Since new users default to `readonly`, you'll need to manually create your first `data_editor`:

1. Create a user account through your app's signup flow
2. In Supabase SQL Editor, run:
   ```sql
   SELECT set_user_role('YOUR-USER-UUID', 'data_editor');
   ```
3. This user can then manage other users' roles through the UI

## Role Validation in Your App

### Check User Role Client-Side

```typescript
import { useUser } from '@supabase/auth-helpers-react'

export function useUserRole() {
  const user = useUser()
  const role = user?.user_metadata?.role || 'readonly'
  
  return {
    role,
    isDataEditor: role === 'data_editor',
    isReadOnly: role === 'readonly'
  }
}
```

### Conditional UI Rendering

```typescript
function DrugEditForm() {
  const { isDataEditor } = useUserRole()
  
  if (!isDataEditor) {
    return <div>You don't have permission to edit data.</div>
  }
  
  return <MetadataForm ... />
}
```

## Security Notes

- Users default to `readonly` role for security
- Role changes require `data_editor` privileges
- Database policies enforce permissions at the data layer
- User metadata is stored securely in Supabase Auth
- Service role key is required for role management (server-side only) 