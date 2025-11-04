import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, MapPin, BookOpen, Dumbbell, Film, Ticket } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const initializePage = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        await fetchBookings(session.user.id);
      }
      setIsLoading(false);
    };

    initializePage();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setUser(session.user);
        fetchBookings(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchBookings = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error("[Dashboard] Error fetching bookings:", error);
      toast.error("Unable to load bookings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-secondary text-secondary-foreground";
      case "used":
        return "bg-muted text-muted-foreground";
      case "cancelled":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getBookingTypeIcon = (type: string) => {
    switch (type) {
      case "museum":
        return <MapPin className="h-4 w-4" />;
      case "library":
        return <BookOpen className="h-4 w-4" />;
      case "sports":
        return <Dumbbell className="h-4 w-4" />;
      case "movie":
        return <Film className="h-4 w-4" />;
      case "event":
        return <Ticket className="h-4 w-4" />;
      default:
        return <Ticket className="h-4 w-4" />;
    }
  };

  const getBookingTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      museum: "Museum Visit",
      library: "Library Booking",
      sports: "Sports Facility",
      movie: "Movie Theater",
      event: "Event Ticket",
    };
    return labels[type] || type;
  };

  const filteredBookings = bookings.filter((booking) =>
    booking.booking_reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.booking_data.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      <main className="container px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="mb-2 text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">Your Bookings</h1>
          <p className="text-sm sm:text-base text-muted-foreground">View and manage all your bookings</p>
        </div>

        <div className="mb-4 sm:mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 sm:top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by reference or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-9 sm:h-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center text-sm sm:text-base text-muted-foreground">Loading bookings...</div>
        ) : filteredBookings.length === 0 ? (
          <Card className="bg-card p-8 sm:p-12 text-center shadow-lg">
            <p className="text-base sm:text-lg text-muted-foreground">No bookings found</p>
          </Card>
        ) : (
          <div className="grid gap-3 sm:gap-4">
            {filteredBookings.map((booking) => (
              <Link key={booking.id} to={`/ticket/${booking.id}`}>
                <Card className="cursor-pointer bg-card p-4 sm:p-6 shadow-lg transition-all hover:shadow-xl">
                  <div className="flex items-start justify-between gap-2 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="mb-2 sm:mb-3 flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <Badge className="bg-primary text-primary-foreground text-xs">
                          <span className="flex items-center gap-1">
                            {getBookingTypeIcon(booking.booking_type)}
                            <span className="hidden xs:inline">{getBookingTypeLabel(booking.booking_type)}</span>
                          </span>
                        </Badge>
                        <Badge className={`${getStatusColor(booking.status)} text-xs`}>
                          {booking.status}
                        </Badge>
                      </div>
                      <h3 className="mb-1 sm:mb-2 text-base sm:text-lg md:text-xl font-semibold text-foreground truncate">
                        {booking.booking_data.name} - {booking.booking_reference}
                      </h3>
                      <div className="text-xs sm:text-sm text-muted-foreground">
                        <p>Date: {new Date(booking.booking_date).toLocaleDateString()} at {new Date(booking.booking_date).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
