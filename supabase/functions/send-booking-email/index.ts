import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingEmailRequest {
  bookingId: string;
  userEmail: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify JWT and get authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const authClient = createClient(supabaseUrl, supabaseAnonKey);
    
    const { data: { user }, error: authError } = await authClient.auth.getUser(token);
    
    if (authError || !user) {
      console.error("[Auth] Invalid token");
      return new Response(
        JSON.stringify({ error: "Invalid authentication" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { bookingId, userEmail }: BookingEmailRequest = await req.json();
    
    console.log("Sending booking email for:", bookingId, "to:", userEmail);

    // Initialize Supabase client with service role for booking fetch
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch booking details and verify ownership
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (bookingError || !booking) {
      console.error("[Booking] Fetch error:", bookingError);
      return new Response(
        JSON.stringify({ error: "Booking not found" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Verify the email matches the booking data and user ownership
    const bookingData = booking.booking_data as any;
    if (bookingData.email !== userEmail || bookingData.email !== user.email) {
      console.error("[Security] Email mismatch attempt");
      return new Response(
        JSON.stringify({ error: "Unauthorized access" }),
        { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    const bookingType = booking.booking_type;
    const bookingReference = booking.booking_reference;
    const qrCodeData = booking.qr_code_data;

    // Build email content based on booking type
    let specificDetails = "";
    
    switch (bookingType) {
      case "museum":
        specificDetails = `
          <p><strong>Museum:</strong> ${bookingData.museum}</p>
          <p><strong>Number of Visitors:</strong> ${bookingData.visitors}</p>
        `;
        break;
      case "library":
        specificDetails = `
          <p><strong>Purpose:</strong> ${bookingData.purpose}</p>
          <p><strong>Duration:</strong> ${bookingData.duration} hours</p>
        `;
        break;
      case "sports":
        specificDetails = `
          <p><strong>Facility:</strong> ${bookingData.facility}</p>
          <p><strong>Duration:</strong> ${bookingData.duration} hours</p>
        `;
        break;
      case "movie":
        specificDetails = `
          <p><strong>Movie:</strong> ${bookingData.movie}</p>
          <p><strong>Screen:</strong> ${bookingData.screen}</p>
          <p><strong>Seats:</strong> ${bookingData.seats}</p>
        `;
        break;
      case "event":
        specificDetails = `
          <p><strong>Event:</strong> ${bookingData.event}</p>
          <p><strong>Tickets:</strong> ${bookingData.tickets}</p>
          <p><strong>Category:</strong> ${bookingData.category}</p>
        `;
        break;
    }

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333; text-align: center;">Booking Confirmation</h1>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #555; margin-top: 0;">Booking Reference: ${bookingReference}</h2>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #666;">Personal Information</h3>
            <p><strong>Name:</strong> ${bookingData.name}</p>
            <p><strong>Email:</strong> ${bookingData.email}</p>
            <p><strong>Phone:</strong> ${bookingData.phone}</p>
          </div>

          <div style="margin: 20px 0;">
            <h3 style="color: #666;">Booking Details</h3>
            <p><strong>Type:</strong> ${bookingType.charAt(0).toUpperCase() + bookingType.slice(1)}</p>
            <p><strong>Date:</strong> ${bookingData.date}</p>
            <p><strong>Time:</strong> ${bookingData.time}</p>
            <p><strong>State:</strong> ${bookingData.state}</p>
            ${specificDetails}
          </div>

          <div style="margin: 30px 0; text-align: center;">
            <h3 style="color: #666;">Your QR Code</h3>
            <img src="${qrCodeData}" alt="Booking QR Code" style="max-width: 250px; border: 2px solid #ddd; padding: 10px; background: white;"/>
            <p style="color: #888; font-size: 12px;">Show this QR code at the venue</p>
          </div>
        </div>

        <div style="text-align: center; color: #888; font-size: 12px; margin-top: 30px;">
          <p>Thank you for your booking!</p>
          <p>Please keep this email for your records.</p>
        </div>
      </div>
    `;

    const emailResponse = await resend.emails.send({
      from: "Bookings <onboarding@resend.dev>",
      to: [userEmail],
      subject: `Booking Confirmation - ${bookingReference}`,
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("[EdgeFunction] Error in send-booking-email:", error);
    return new Response(
      JSON.stringify({ 
        error: "An error occurred processing your request",
        code: "INTERNAL_ERROR"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
