import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Users, Clock, Film, BookOpen, Dumbbell, Ticket } from "lucide-react";
import museumImg from "@/assets/museum.jpg";
import libraryImg from "@/assets/library.jpg";
import sportsImg from "@/assets/sports.jpg";
import movieImg from "@/assets/movie.jpg";
import eventImg from "@/assets/event.jpg";

interface BookingFormProps {
  onSubmit: (bookingType: string, bookingData: any) => void;
  isLoading: boolean;
}

const BookingForm = ({ onSubmit, isLoading }: BookingFormProps) => {
  const [bookingType, setBookingType] = useState<string>("");
  const [formData, setFormData] = useState<any>({});

  const bookingTypes = [
    { value: "museum", label: "Museum Visit", icon: MapPin, image: museumImg },
    { value: "library", label: "Library Booking", icon: BookOpen, image: libraryImg },
    { value: "sports", label: "Sports Facility", icon: Dumbbell, image: sportsImg },
    { value: "movie", label: "Movie Theater", icon: Film, image: movieImg },
    { value: "event", label: "Event Ticket", icon: Ticket, image: eventImg },
  ];

  const timeSlots = [
    { value: "09:00", label: "9:00 AM" },
    { value: "13:00", label: "1:00 PM" },
    { value: "16:00", label: "4:00 PM" },
    { value: "18:00", label: "6:00 PM" },
  ];

  const indianStates = [
    "Maharashtra",
    "Delhi",
    "Karnataka",
    "Tamil Nadu",
    "West Bengal",
    "Rajasthan",
    "Uttar Pradesh",
    "Gujarat",
    "Kerala",
    "Madhya Pradesh",
    "Telangana",
    "Andhra Pradesh",
    "Punjab",
    "Haryana",
    "Bihar",
    "Odisha",
    "Assam",
    "Jharkhand",
    "Goa",
    "Uttarakhand",
  ];

  const museumsByState: Record<string, string[]> = {
    "Maharashtra": ["Chhatrapati Shivaji Maharaj Vastu Sangrahalaya", "Prince of Wales Museum", "Dr. Bhau Daji Lad Museum", "Nehru Science Centre"],
    "Delhi": ["National Museum", "National Rail Museum", "National Gallery of Modern Art", "Indira Gandhi Memorial Museum"],
    "Karnataka": ["Government Museum Bangalore", "Visvesvaraya Industrial & Technological Museum", "HAL Aerospace Museum", "National Gallery of Modern Art"],
    "Tamil Nadu": ["Government Museum Chennai", "Fort Museum", "National Art Gallery", "Vivekananda House"],
    "West Bengal": ["Indian Museum Kolkata", "Victoria Memorial", "Marble Palace", "Science City"],
    "Rajasthan": ["City Palace Museum Jaipur", "Albert Hall Museum", "Mehrangarh Fort Museum", "Umaid Bhawan Palace Museum"],
    "Uttar Pradesh": ["State Museum Lucknow", "Allahabad Museum", "Sarnath Museum", "Government Museum Mathura"],
    "Gujarat": ["Calico Museum of Textiles", "Baroda Museum", "Sardar Vallabhbhai Patel Museum", "Kite Museum"],
    "Kerala": ["Napier Museum", "Kerala Folklore Museum", "Hill Palace Museum", "Indo-Portuguese Museum"],
    "Madhya Pradesh": ["Central Museum Indore", "State Museum Bhopal", "Tribal Museum", "Archaeological Museum Gwalior"],
    "Telangana": ["Salar Jung Museum", "Telangana State Museum", "Nizam Museum", "City Museum"],
    "Andhra Pradesh": ["Archaeological Museum Amaravati", "Victoria Jubilee Museum", "Visakha Museum", "Kondapalli Fort Museum"],
    "Punjab": ["Punjab State War Heroes Memorial & Museum", "Partition Museum", "Government Museum Chandigarh", "Maharaja Ranjit Singh Museum"],
    "Haryana": ["Haryana State Museum", "Archaeological Museum Kurukshetra", "Surajkund Crafts Museum", "Railway Heritage Museum"],
    "Bihar": ["Patna Museum", "Bihar Museum", "Nalanda Archaeological Museum", "Jalan Museum"],
    "Odisha": ["Odisha State Museum", "Regional Museum of Natural History", "Tribal Museum", "Odisha Maritime Museum"],
    "Assam": ["Assam State Museum", "Tea Museum", "Don Bosco Museum", "Science Museum"],
    "Jharkhand": ["Tribal Research Institute Museum", "Ranchi Museum", "Jamshedpur Tribal Museum", "State Museum"],
    "Goa": ["Goa State Museum", "Archaeological Museum Old Goa", "Naval Aviation Museum", "Goa Chitra Museum"],
    "Uttarakhand": ["Uttarakhand State Museum", "Forest Research Institute Museum", "Kumaon Regimental Centre Museum", "Wax Museum"],
  };

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
          <Label htmlFor="time">Time Slot</Label>
          <Select onValueChange={(value) => updateFormData("time", value)} required>
            <SelectTrigger>
              <SelectValue placeholder="Select time slot" />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map((slot) => (
                <SelectItem key={slot.value} value={slot.value}>
                  {slot.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="state">State</Label>
          <Select onValueChange={(value) => {
            updateFormData("state", value);
            if (bookingType === "museum") {
              updateFormData("museum", "");
            }
          }} required>
            <SelectTrigger>
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {indianStates.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
              <Select 
                onValueChange={(value) => updateFormData("museum", value)} 
                required
                disabled={!formData.state}
                value={formData.museum || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder={formData.state ? "Select museum" : "Select state first"} />
                </SelectTrigger>
                <SelectContent>
                  {formData.state && museumsByState[formData.state]?.map((museum) => (
                    <SelectItem key={museum} value={museum}>
                      {museum}
                    </SelectItem>
                  ))}
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

  const selectedType = bookingTypes.find(t => t.value === bookingType);

  return (
    <Card className="p-6 bg-card shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="bookingType" className="text-lg font-semibold mb-4 block">Select Booking Type</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookingTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setBookingType(type.value)}
                  className={`relative overflow-hidden rounded-lg border-2 transition-all ${
                    bookingType === type.value
                      ? "border-primary shadow-lg scale-105"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <img
                    src={type.image}
                    alt={type.label}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-3 bg-background/95 backdrop-blur">
                    <div className="flex items-center gap-2 justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                      <span className="font-medium">{type.label}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {selectedType && (
          <div className="pt-4 border-t">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={selectedType.image}
                alt={selectedType.label}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-semibold text-lg">{selectedType.label}</h3>
                <p className="text-sm text-muted-foreground">Complete your booking details</p>
              </div>
            </div>
          </div>
        )}

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