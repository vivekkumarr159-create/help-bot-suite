import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import BookingForm from "@/components/BookingForm";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Chat = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleBookingSubmit = async (bookingType: string, bookingData: any) => {
    setIsLoading(true);

    try {
      // Combine date and time for booking_date
      const bookingDateTime = new Date(`${bookingData.date}T${bookingData.time}`);
      
      // Generate QR code data
      const qrCodeData = JSON.stringify({
        type: bookingType,
        data: bookingData,
        timestamp: new Date().toISOString(),
      });

      // Insert booking into database
      const { data, error } = await supabase
        .from("bookings")
        .insert({
          booking_type: bookingType,
          booking_data: bookingData as any,
          booking_date: bookingDateTime.toISOString(),
          qr_code_data: qrCodeData,
        } as any)
        .select()
        .single();

      if (error) throw error;

      toast.success("Booking created successfully!");
      navigate(`/ticket/${data.id}`);
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Failed to create booking. Please try again.");
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
