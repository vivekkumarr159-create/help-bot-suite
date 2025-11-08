import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Search, Save } from "lucide-react";
import BookingTicket from "@/components/BookingTicket";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SupportDashboard = () => {
  const navigate = useNavigate();
  const [searchRef, setSearchRef] = useState("");
  const [booking, setBooking] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});

  useEffect(() => {
    const checkAuthAndRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Please sign in to access this page");
        navigate("/auth");
        return;
      }

      await checkUserRole();
    };

    checkAuthAndRole();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkUserRole = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      const hasAdminOrSupport = roles?.some(r => r.role === "admin" || r.role === "support");
      
      if (!hasAdminOrSupport) {
        toast.error("Access denied. Admin or Support role required.");
        navigate("/dashboard");
        return;
      }

      setUserRole(roles?.[0]?.role || null);
    } catch (error) {
      console.error("[SupportDashboard] Error checking role:", error);
      navigate("/auth");
    }
  };

  const handleSearch = async () => {
    if (!searchRef.trim()) {
      toast.error("Please enter a booking reference");
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("booking_reference", searchRef.toUpperCase())
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        toast.error("Booking not found");
        setBooking(null);
        return;
      }

      setBooking(data);
      setEditData(data.booking_data);
      toast.success("Booking found");
    } catch (error) {
      console.error("[SupportDashboard] Search error:", error);
      toast.error("Failed to search booking");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!booking) return;

    try {
      setIsSaving(true);
      
      // Validate the edited data using the appropriate schema
      const { getSchemaForBookingType } = await import('@/utils/bookingValidation');
      const schema = getSchemaForBookingType(booking.booking_type);
      
      // Parse numeric fields properly
      const dataToValidate = {
        ...editData,
        visitors: editData.visitors ? Number(editData.visitors) : undefined,
        seats: editData.seats ? Number(editData.seats) : undefined,
        tickets: editData.tickets ? Number(editData.tickets) : undefined,
        duration: editData.duration ? Number(editData.duration) : undefined,
      };

      const validationResult = schema.safeParse(dataToValidate);
      
      if (!validationResult.success) {
        const errorMessage = validationResult.error.errors
          .map(err => `${err.path.join('.')}: ${err.message}`)
          .join(', ');
        
        toast.error(`Validation Error: ${errorMessage}`);
        setIsSaving(false);
        return;
      }

      // Use validated data
      const validatedData = validationResult.data;
      
      const { error } = await supabase
        .from("bookings")
        .update({
          booking_data: validatedData,
        })
        .eq("id", booking.id);

      if (error) throw error;

      // Generate new QR code data
      const qrData = JSON.stringify({
        type: booking.booking_type,
        data: validatedData,
        timestamp: new Date().toISOString(),
        userId: booking.user_id,
      });

      const { error: qrError } = await supabase
        .from("bookings")
        .update({
          qr_code_data: qrData,
        })
        .eq("id", booking.id);

      if (qrError) throw qrError;

      toast.success("Booking updated successfully");
      
      // Refresh booking data
      const { data: updatedBooking } = await supabase
        .from("bookings")
        .select("*")
        .eq("id", booking.id)
        .single();

      if (updatedBooking) {
        setBooking(updatedBooking);
        setEditData(updatedBooking.booking_data);
      }
    } catch (error) {
      console.error("[SupportDashboard] Save error:", error);
      toast.error("Failed to update booking");
    } finally {
      setIsSaving(false);
    }
  };

  const updateEditData = (key: string, value: any) => {
    setEditData((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      <main className="container py-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-6 text-4xl font-bold text-foreground">
            {userRole === "admin" ? "Admin" : "Support"} Dashboard
          </h1>
          
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Search Booking by Reference</h2>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Enter booking reference (e.g., ABC12345)"
                  value={searchRef}
                  onChange={(e) => setSearchRef(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch} disabled={isLoading} className="gap-2">
                <Search className="h-4 w-4" />
                {isLoading ? "Searching..." : "Search"}
              </Button>
            </div>
          </Card>

          {booking && (
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Edit Booking Details</h2>
                <Card className="p-6 space-y-4">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={editData.name || ""}
                      onChange={(e) => updateEditData("name", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={editData.email || ""}
                      onChange={(e) => updateEditData("email", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={editData.phone || ""}
                      onChange={(e) => updateEditData("phone", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={editData.date || ""}
                      onChange={(e) => updateEditData("date", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Time</Label>
                    <Input
                      value={editData.time || ""}
                      onChange={(e) => updateEditData("time", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>State</Label>
                    <Input
                      value={editData.state || ""}
                      onChange={(e) => updateEditData("state", e.target.value)}
                    />
                  </div>

                  {booking.booking_type === "museum" && (
                    <>
                      <div>
                        <Label>Museum</Label>
                        <Input
                          value={editData.museum || ""}
                          onChange={(e) => updateEditData("museum", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Visitors</Label>
                        <Input
                          type="number"
                          value={editData.visitors || ""}
                          onChange={(e) => updateEditData("visitors", e.target.value)}
                        />
                      </div>
                    </>
                  )}

                  {booking.booking_type === "library" && (
                    <>
                      <div>
                        <Label>Purpose</Label>
                        <Select 
                          value={editData.purpose || ""} 
                          onValueChange={(value) => updateEditData("purpose", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="study">Study Room</SelectItem>
                            <SelectItem value="research">Research</SelectItem>
                            <SelectItem value="meeting">Meeting Room</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Duration (hours)</Label>
                        <Input
                          type="number"
                          value={editData.duration || ""}
                          onChange={(e) => updateEditData("duration", e.target.value)}
                        />
                      </div>
                    </>
                  )}

                  {booking.booking_type === "sports" && (
                    <>
                      <div>
                        <Label>Facility</Label>
                        <Select 
                          value={editData.facility || ""} 
                          onValueChange={(value) => updateEditData("facility", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tennis">Tennis Court</SelectItem>
                            <SelectItem value="basketball">Basketball Court</SelectItem>
                            <SelectItem value="swimming">Swimming Pool</SelectItem>
                            <SelectItem value="gym">Gym</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Duration (hours)</Label>
                        <Input
                          type="number"
                          value={editData.duration || ""}
                          onChange={(e) => updateEditData("duration", e.target.value)}
                        />
                      </div>
                    </>
                  )}

                  {booking.booking_type === "movie" && (
                    <>
                      <div>
                        <Label>Movie</Label>
                        <Input
                          value={editData.movie || ""}
                          onChange={(e) => updateEditData("movie", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Seats</Label>
                        <Input
                          type="number"
                          value={editData.seats || ""}
                          onChange={(e) => updateEditData("seats", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Screen</Label>
                        <Input
                          value={editData.screen || ""}
                          onChange={(e) => updateEditData("screen", e.target.value)}
                        />
                      </div>
                    </>
                  )}

                  {booking.booking_type === "event" && (
                    <>
                      <div>
                        <Label>Event</Label>
                        <Input
                          value={editData.event || ""}
                          onChange={(e) => updateEditData("event", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Tickets</Label>
                        <Input
                          type="number"
                          value={editData.tickets || ""}
                          onChange={(e) => updateEditData("tickets", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Category</Label>
                        <Select 
                          value={editData.category || ""} 
                          onValueChange={(value) => updateEditData("category", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="vip">VIP</SelectItem>
                            <SelectItem value="premium">Premium</SelectItem>
                            <SelectItem value="standard">Standard</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  <Button 
                    onClick={handleSave} 
                    disabled={isSaving} 
                    className="w-full gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </Card>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Ticket Preview</h2>
                <BookingTicket booking={booking} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SupportDashboard;
