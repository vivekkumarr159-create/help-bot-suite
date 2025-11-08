import { z } from "zod";

export const baseBookingSchema = z.object({
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

export const museumBookingSchema = baseBookingSchema.extend({
  museum: z.string().min(1, "Museum selection is required"),
  visitors: z.number().int().min(1, "At least 1 visitor required").max(50, "Maximum 50 visitors allowed"),
});

export const eventBookingSchema = baseBookingSchema.extend({
  event: z.string().min(1, "Event selection is required"),
  tickets: z.number().int().min(1, "At least 1 ticket required").max(20, "Maximum 20 tickets allowed"),
});

export const movieBookingSchema = baseBookingSchema.extend({
  movie: z.string().min(1, "Movie selection is required"),
  seats: z.number().int().min(1, "At least 1 seat required").max(10, "Maximum 10 seats allowed"),
});

export const facilityBookingSchema = baseBookingSchema.extend({
  facility: z.string().min(1, "Facility selection is required"),
  duration: z.number().int().min(1, "At least 1 hour required").max(8, "Maximum 8 hours allowed"),
});

export const libraryBookingSchema = baseBookingSchema.extend({
  purpose: z.string().min(1, "Purpose is required"),
});

export const getSchemaForBookingType = (bookingType: string) => {
  switch (bookingType) {
    case 'museum':
      return museumBookingSchema;
    case 'event':
      return eventBookingSchema;
    case 'movie':
      return movieBookingSchema;
    case 'sports':
      return facilityBookingSchema;
    case 'library':
      return libraryBookingSchema;
    default:
      return baseBookingSchema;
  }
};
