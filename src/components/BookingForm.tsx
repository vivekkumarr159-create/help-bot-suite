import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Users, Clock, Film, BookOpen, Dumbbell, Ticket } from "lucide-react";

interface BookingFormProps {
  onSubmit: (bookingType: string, bookingData: any) => void;
  isLoading: boolean;
}

const BookingForm = ({ onSubmit, isLoading }: BookingFormProps) => {
  const [bookingType, setBookingType] = useState<string>("");
  const [formData, setFormData] = useState<any>({});

  const bookingTypes = [
    { value: "museum", label: "Museum Visit", icon: MapPin },
    { value: "library", label: "Library Booking", icon: BookOpen },
    { value: "sports", label: "Sports Facility", icon: Dumbbell },
    { value: "movie", label: "Movie Theater", icon: Film },
    { value: "event", label: "Event Ticket", icon: Ticket },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(bookingType, formData);
  };

  const updateFormData = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  const renderBookingTypeIcon = () => {
    const type = bookingTypes.find(t => t.value === bookingType);
    if (!type) return null;
    const Icon = type.icon;
    return <Icon className="h-5 w-5" />;
  };

  const renderFields = () => {
    if (!bookingType) return null;

    const commonFields = (
      <>
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            required
            value={formData.name || ""}
            onChange={(e) => updateFormData("name", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={formData.email || ""}
            onChange={(e) => updateFormData("email", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            required
            value={formData.phone || ""}
            onChange={(e) => updateFormData("phone", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            required
            value={formData.date || ""}
            onChange={(e) => updateFormData("date", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="time">Time</Label>
          <Input
            id="time"
            type="time"
            required
            value={formData.time || ""}
            onChange={(e) => updateFormData("time", e.target.value)}
          />
        </div>
      </>
    );

    switch (bookingType) {
      case "museum":
        return (
          <>
            {commonFields}
            <div>
              <Label htmlFor="museum">Museum</Label>
              <Select onValueChange={(value) => updateFormData("museum", value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select museum" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="national">National Museum</SelectItem>
                  <SelectItem value="art">Art Museum</SelectItem>
                  <SelectItem value="history">History Museum</SelectItem>
                  <SelectItem value="science">Science Museum</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="visitors">Number of Visitors</Label>
              <Input
                id="visitors"
                type="number"
                min="1"
                required
                value={formData.visitors || ""}
                onChange={(e) => updateFormData("visitors", e.target.value)}
              />
            </div>
          </>
        );

      case "library":
        return (
          <>
            {commonFields}
            <div>
              <Label htmlFor="purpose">Purpose</Label>
              <Select onValueChange={(value) => updateFormData("purpose", value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="study">Study Room</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                  <SelectItem value="meeting">Meeting Room</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="duration">Duration (hours)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="8"
                required
                value={formData.duration || ""}
                onChange={(e) => updateFormData("duration", e.target.value)}
              />
            </div>
          </>
        );

      case "sports":
        return (
          <>
            {commonFields}
            <div>
              <Label htmlFor="facility">Facility</Label>
              <Select onValueChange={(value) => updateFormData("facility", value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select facility" />
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
              <Label htmlFor="duration">Duration (hours)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="4"
                required
                value={formData.duration || ""}
                onChange={(e) => updateFormData("duration", e.target.value)}
              />
            </div>
          </>
        );

      case "movie":
        return (
          <>
            {commonFields}
            <div>
              <Label htmlFor="movie">Movie</Label>
              <Select onValueChange={(value) => updateFormData("movie", value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select movie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="action">Action Movie</SelectItem>
                  <SelectItem value="comedy">Comedy Show</SelectItem>
                  <SelectItem value="drama">Drama Film</SelectItem>
                  <SelectItem value="scifi">Sci-Fi Adventure</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="seats">Number of Seats</Label>
              <Input
                id="seats"
                type="number"
                min="1"
                max="10"
                required
                value={formData.seats || ""}
                onChange={(e) => updateFormData("seats", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="screen">Screen</Label>
              <Select onValueChange={(value) => updateFormData("screen", value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select screen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Screen 1 (Standard)</SelectItem>
                  <SelectItem value="2">Screen 2 (IMAX)</SelectItem>
                  <SelectItem value="3">Screen 3 (3D)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );

      case "event":
        return (
          <>
            {commonFields}
            <div>
              <Label htmlFor="event">Event</Label>
              <Select onValueChange={(value) => updateFormData("event", value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select event" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="concert">Concert</SelectItem>
                  <SelectItem value="conference">Conference</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="exhibition">Exhibition</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tickets">Number of Tickets</Label>
              <Input
                id="tickets"
                type="number"
                min="1"
                max="10"
                required
                value={formData.tickets || ""}
                onChange={(e) => updateFormData("tickets", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="category">Ticket Category</Label>
              <Select onValueChange={(value) => updateFormData("category", value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vip">VIP</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="p-6 bg-card shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="bookingType">Select Booking Type</Label>
          <Select onValueChange={setBookingType} required>
            <SelectTrigger>
              <SelectValue placeholder="Choose what to book" />
            </SelectTrigger>
            <SelectContent>
              {bookingTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {type.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {renderFields()}

        {bookingType && (
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full gap-2 bg-gradient-primary hover:opacity-90"
          >
            {renderBookingTypeIcon()}
            {isLoading ? "Creating Booking..." : "Create Booking"}
          </Button>
        )}
      </form>
    </Card>
  );
};

export default BookingForm;