import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Header from "@/components/Header";
import BookingForm from "@/components/BookingForm";
import QRCode from "qrcode";
import type { User } from "@supabase/supabase-js";

const Chat = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
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

      // Generate QR code data (raw string, not data URL)
      const qrData = JSON.stringify({
        type: bookingType,
        data: bookingData,
        timestamp: new Date().toISOString(),
        userId: user.id,
      });

      // Save to database
      const { data, error } = await supabase
        .from("bookings")
        .insert([{
          booking_type: bookingType,
          booking_data: bookingData as any,
          booking_date: new Date(bookingData.date).toISOString(),
          qr_code_data: qrData,
          status: "confirmed",
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) throw error;

      // Send confirmation email
      const userEmail = user.email || bookingData.email;
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
      <main className="container py-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-6 text-4xl font-bold text-foreground">Create New Booking</h1>
          <p className="mb-8 text-lg text-muted-foreground">
            Select your booking type and fill in the details to get your ticket with QR code
          </p>
          
          <BookingForm onSubmit={handleBookingSubmit} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
};

export default Chat;
