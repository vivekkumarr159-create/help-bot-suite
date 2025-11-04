import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.78.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Calculate date 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    console.log(`[Cleanup] Deleting bookings older than: ${thirtyDaysAgo.toISOString()}`);

    // Delete bookings that are confirmed and 30 days past their booking_date
    const { data, error } = await supabase
      .from('bookings')
      .delete()
      .lte('booking_date', thirtyDaysAgo.toISOString())
      .select();

    if (error) {
      console.error('[Cleanup] Error deleting bookings:', error);
      throw error;
    }

    const deletedCount = data?.length || 0;
    console.log(`[Cleanup] Successfully deleted ${deletedCount} expired bookings`);

    return new Response(
      JSON.stringify({
        success: true,
        deleted: deletedCount,
        message: `Deleted ${deletedCount} bookings older than 30 days`,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('[Cleanup] Function error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});