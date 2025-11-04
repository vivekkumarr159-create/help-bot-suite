import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, User, Mail, Phone, Hash } from "lucide-react";
import QRCode from "qrcode";

interface BookingTicketProps {
  booking: {
    id: string;
    booking_type: string;
    booking_data: any;
    booking_reference: string;
    booking_date: string;
    qr_code_data: string;
    status: string;
  };
}

const BookingTicket = ({ booking }: BookingTicketProps) => {
  const qrRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (qrRef.current && booking.qr_code_data) {
      QRCode.toCanvas(qrRef.current, booking.qr_code_data, {
        width: 200,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      });
    }
  }, [booking.qr_code_data]);

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

  const isExpired = () => {
    const bookingDateTime = new Date(`${booking.booking_data.date}T${booking.booking_data.time}`);
    return bookingDateTime < new Date();
  };

  const getStatusColor = (status: string) => {
    if (isExpired() && status === "confirmed") {
      return "bg-destructive text-destructive-foreground";
    }
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

  const getDisplayStatus = () => {
    if (isExpired() && booking.status === "confirmed") {
      return "expired";
    }
    return booking.status;
  };

  const renderBookingDetails = () => {
    const { booking_data } = booking;
    const details: JSX.Element[] = [];

    switch (booking.booking_type) {
      case "museum":
        details.push(
          <div key="museum" className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{booking_data.museum} Museum</span>
          </div>
        );
        if (booking_data.visitors) {
          details.push(
            <div key="visitors" className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{booking_data.visitors} Visitor{booking_data.visitors > 1 ? "s" : ""}</span>
            </div>
          );
        }
        break;

      case "library":
        details.push(
          <div key="purpose" className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{booking_data.purpose}</span>
          </div>
        );
        if (booking_data.duration) {
          details.push(
            <div key="duration" className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{booking_data.duration} hour{booking_data.duration > 1 ? "s" : ""}</span>
            </div>
          );
        }
        break;

      case "sports":
        details.push(
          <div key="facility" className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{booking_data.facility}</span>
          </div>
        );
        if (booking_data.duration) {
          details.push(
            <div key="duration" className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{booking_data.duration} hour{booking_data.duration > 1 ? "s" : ""}</span>
            </div>
          );
        }
        break;

      case "movie":
        details.push(
          <div key="movie" className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{booking_data.movie}</span>
          </div>
        );
        if (booking_data.seats) {
          details.push(
            <div key="seats" className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{booking_data.seats} Seat{booking_data.seats > 1 ? "s" : ""}</span>
            </div>
          );
        }
        if (booking_data.screen) {
          details.push(
            <div key="screen" className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <span>Screen {booking_data.screen}</span>
            </div>
          );
        }
        break;

      case "event":
        details.push(
          <div key="event" className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{booking_data.event}</span>
          </div>
        );
        if (booking_data.tickets) {
          details.push(
            <div key="tickets" className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{booking_data.tickets} Ticket{booking_data.tickets > 1 ? "s" : ""}</span>
            </div>
          );
        }
        if (booking_data.category) {
          details.push(
            <div key="category" className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <span>{booking_data.category} Class</span>
            </div>
          );
        }
        break;
    }

    return details;
  };

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-card to-card/80 shadow-elegant">
      <div className="bg-gradient-primary p-4 sm:p-6 text-primary-foreground">
        <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-xl sm:text-2xl font-bold">{getBookingTypeLabel(booking.booking_type)}</h2>
          <Badge className={`${getStatusColor(booking.status)} text-xs sm:text-sm`}>{getDisplayStatus()}</Badge>
        </div>
        <div className="flex items-center gap-2 text-base sm:text-lg font-mono">
          <Hash className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="break-all">{booking.booking_reference}</span>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 p-4 sm:p-6 md:grid-cols-2">
        <div className="space-y-3 sm:space-y-4">
          <div>
            <h3 className="mb-2 sm:mb-3 text-base sm:text-lg font-semibold text-foreground">Booking Details</h3>
            <div className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="break-words">{booking.booking_data.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="break-all">{booking.booking_data.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span>{booking.booking_data.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span>{booking.booking_data.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span>{booking.booking_data.time}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-2 sm:mb-3 text-base sm:text-lg font-semibold text-foreground">Additional Information</h3>
            <div className="space-y-2 text-xs sm:text-sm text-muted-foreground">{renderBookingDetails()}</div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 order-first md:order-last">
          <div className="rounded-lg bg-white p-3 sm:p-4 shadow-lg">
            <canvas ref={qrRef} className="max-w-[160px] sm:max-w-[200px]" />
          </div>
          <p className="text-center text-xs sm:text-sm text-muted-foreground px-2">
            Scan this QR code at the venue for quick entry
          </p>
        </div>
      </div>

      <div className="border-t border-border bg-muted/30 p-3 sm:p-4 text-center text-xs text-muted-foreground">
        Please arrive 15 minutes before your scheduled time. Keep this ticket handy for entry.
      </div>
    </Card>
  );
};

export default BookingTicket;