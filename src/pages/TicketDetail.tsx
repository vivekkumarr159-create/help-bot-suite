import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import BookingTicket from "@/components/BookingTicket";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const TicketDetail = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const fetchBooking = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please sign in to view booking details");
        return;
      }

      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        toast.error("Booking not found or access denied");
      }
      
      setBooking(data);
    } catch (error) {
      console.error("[TicketDetail] Error fetching booking:", error);
      toast.error("Unable to load booking details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      <main className="container py-8">
        <Link to="/dashboard">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        {isLoading ? (
          <div className="text-center text-muted-foreground">Loading booking...</div>
        ) : booking ? (
          <>
            <h1 className="mb-6 text-4xl font-bold text-foreground">Your Booking Ticket</h1>
            <BookingTicket booking={booking} />
          </>
        ) : (
          <div className="text-center text-muted-foreground">Booking not found</div>
        )}
      </main>
    </div>
  );
};

export default TicketDetail;
