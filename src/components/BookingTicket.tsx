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
      <div className="bg-gradient-primary p-6 text-primary-foreground">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">{getBookingTypeLabel(booking.booking_type)}</h2>
          <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
        </div>
        <div className="flex items-center gap-2 text-lg font-mono">
          <Hash className="h-5 w-5" />
          {booking.booking_reference}
        </div>
      </div>

      <div className="grid gap-6 p-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <h3 className="mb-3 text-lg font-semibold text-foreground">Booking Details</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{booking.booking_data.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{booking.booking_data.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>{booking.booking_data.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{booking.booking_data.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{booking.booking_data.time}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-semibold text-foreground">Additional Information</h3>
            <div className="space-y-2 text-sm text-muted-foreground">{renderBookingDetails()}</div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="rounded-lg bg-white p-4 shadow-lg">
            <canvas ref={qrRef} />
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Scan this QR code at the venue for quick entry
          </p>
        </div>
      </div>

      <div className="border-t border-border bg-muted/30 p-4 text-center text-xs text-muted-foreground">
        Please arrive 15 minutes before your scheduled time. Keep this ticket handy for entry.
      </div>
    </Card>
  );
};

export default BookingTicket;