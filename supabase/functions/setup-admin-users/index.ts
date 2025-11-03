import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AdminUser {
  email: string;
  password: string;
  role: 'admin' | 'support';
}

const ADMIN_USERS: AdminUser[] = [
  { email: 'admin101@gmail.com', password: 'Admin@101', role: 'admin' },
  { email: 'admin102@gmail.com', password: 'Admin@102', role: 'admin' },
  { email: 'admin103@gmail.com', password: 'Admin@103', role: 'admin' },
  { email: 'support101@gmail.com', password: 'Support@101', role: 'support' },
  { email: 'support102@gmail.com', password: 'Support@102', role: 'support' },
  { email: 'support103@gmail.com', password: 'Support@103', role: 'support' },
];

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const results = [];

    for (const adminUser of ADMIN_USERS) {
      // Check if user already exists
      const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      
      if (listError) {
        console.error(`Error listing users:`, listError);
        continue;
      }

      const userExists = existingUsers.users.find(u => u.email === adminUser.email);

      let userId: string;

      if (userExists) {
        console.log(`User ${adminUser.email} already exists`);
        userId = userExists.id;
        results.push({ email: adminUser.email, status: 'already_exists', userId });
      } else {
        // Create new user
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: adminUser.email,
          password: adminUser.password,
          email_confirm: true,
        });

        if (createError) {
          console.error(`Error creating user ${adminUser.email}:`, createError);
          results.push({ email: adminUser.email, status: 'error', error: createError.message });
          continue;
        }

        userId = newUser.user.id;
        console.log(`Created user ${adminUser.email}`);
        results.push({ email: adminUser.email, status: 'created', userId });
      }

      // Check if role already assigned
      const { data: existingRole, error: roleCheckError } = await supabaseAdmin
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .eq('role', adminUser.role)
        .maybeSingle();

      if (roleCheckError) {
        console.error(`Error checking role for ${adminUser.email}:`, roleCheckError);
        continue;
      }

      if (!existingRole) {
        // Assign role
        const { error: roleError } = await supabaseAdmin
          .from('user_roles')
          .insert([{
            user_id: userId,
            role: adminUser.role,
          }]);

        if (roleError) {
          console.error(`Error assigning role to ${adminUser.email}:`, roleError);
          results.push({ ...results.find(r => r.email === adminUser.email), roleStatus: 'error', roleError: roleError.message });
        } else {
          console.log(`Assigned ${adminUser.role} role to ${adminUser.email}`);
          results.push({ ...results.find(r => r.email === adminUser.email), roleStatus: 'assigned' });
        }
      } else {
        console.log(`Role ${adminUser.role} already assigned to ${adminUser.email}`);
        results.push({ ...results.find(r => r.email === adminUser.email), roleStatus: 'already_assigned' });
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Admin and support users setup complete',
        results 
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error('Error in setup-admin-users function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'An error occurred during setup' 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
