import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Header from "@/components/Header";
import BookingForm from "@/components/BookingForm";
import QRCode from "qrcode";
import type { User } from "@supabase/supabase-js";
import { z } from "zod";

// Validation schemas for different booking types
const baseBookingSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  email: z.string().trim().email("Invalid email address").max(255, "Email too long"),
  phone: z.string().trim().regex(/^[0-9+\-\s()]{10,15}$/, "Invalid phone number format"),
  date: z.string().refine((d) => {
    const bookingDate = new Date(d);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return bookingDate >= today;
  }, "Date must be today or in the future"),
  time: z.string().min(1, "Time is required"),
});

const museumBookingSchema = baseBookingSchema.extend({
  museum: z.string().min(1, "Museum selection is required"),
  visitors: z.number().int().min(1, "At least 1 visitor required").max(50, "Maximum 50 visitors allowed"),
});

const eventBookingSchema = baseBookingSchema.extend({
  event: z.string().min(1, "Event selection is required"),
  tickets: z.number().int().min(1, "At least 1 ticket required").max(20, "Maximum 20 tickets allowed"),
});

const movieBookingSchema = baseBookingSchema.extend({
  movie: z.string().min(1, "Movie selection is required"),
  seats: z.number().int().min(1, "At least 1 seat required").max(10, "Maximum 10 seats allowed"),
});

const facilityBookingSchema = baseBookingSchema.extend({
  facility: z.string().min(1, "Facility selection is required"),
  duration: z.number().int().min(1, "At least 1 hour required").max(8, "Maximum 8 hours allowed"),
});

const libraryBookingSchema = baseBookingSchema.extend({
  purpose: z.string().min(1, "Purpose is required"),
});

const Chat = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate("/auth");
      } else if (session) {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleBookingSubmit = async (bookingType: string, bookingData: any) => {
    if (!user) {
      toast.error("Please sign in to create a booking");
      navigate("/auth");
      return;
    }

    try {
      setIsLoading(true);

      // Verify current session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Session expired. Please sign in again.");
        navigate("/auth");
        return;
      }

      // Validate booking data based on type
      let validatedData;
      try {
        switch (bookingType) {
          case "museum":
            validatedData = museumBookingSchema.parse(bookingData);
            break;
          case "event":
            validatedData = eventBookingSchema.parse(bookingData);
            break;
          case "movie":
            validatedData = movieBookingSchema.parse(bookingData);
            break;
          case "sports":
            validatedData = facilityBookingSchema.parse(bookingData);
            break;
          case "library":
            validatedData = libraryBookingSchema.parse(bookingData);
            break;
          default:
            throw new Error("Invalid booking type");
        }
      } catch (validationError) {
        if (validationError instanceof z.ZodError) {
          const errorMessages = validationError.errors.map(err => err.message).join(", ");
          toast.error(`Validation failed: ${errorMessages}`);
        } else {
          toast.error("Invalid booking data");
        }
        setIsLoading(false);
        return;
      }

      // Generate QR code data (raw string, not data URL) - use validated data
      const qrData = JSON.stringify({
        type: bookingType,
        data: validatedData,
        timestamp: new Date().toISOString(),
        userId: session.user.id,
      });

      // Save to database - use validated data
      const { data, error } = await supabase
        .from("bookings")
        .insert([{
          booking_type: bookingType,
          booking_data: validatedData as any,
          booking_date: new Date(validatedData.date).toISOString(),
          qr_code_data: qrData,
          status: "confirmed",
          user_id: session.user.id,
        }])
        .select()
        .single();

      if (error) {
        console.error("[Booking] Database error:", error);
        throw error;
      }

      // Send confirmation email - use validated data
      const userEmail = user.email || validatedData.email;
      try {
        const { error: emailError } = await supabase.functions.invoke("send-booking-email", {
          body: {
            bookingId: data.id,
            userEmail: userEmail,
          },
        });

        if (emailError) {
          console.error("Error sending email:", emailError);
          toast.warning("Booking created but email failed to send");
        } else {
          toast.success("Booking created and confirmation email sent!");
        }
      } catch (emailError) {
        console.error("Error sending email:", emailError);
        toast.warning("Booking created but email failed to send");
      }

      navigate(`/ticket/${data.id}`);
    } catch (error: any) {
      console.error("[Booking] Creation error:", error);
      toast.error("Unable to create booking. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      <main className="container px-4 sm:px-6 py-6 sm:py-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">Create New Booking</h1>
          <p className="mb-6 sm:mb-8 text-sm sm:text-base md:text-lg text-muted-foreground">
            Select your booking type and fill in the details to get your ticket with QR code
          </p>
          
          <BookingForm onSubmit={handleBookingSubmit} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
};

export default Chat;
