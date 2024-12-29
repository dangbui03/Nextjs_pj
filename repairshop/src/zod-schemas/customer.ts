import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { customers } from "@/db/schema"
import { z } from "zod"

// export const insertCustomerSchema = createInsertSchema(customers, {
//     firstName: (schema) => schema.firstName.min(1, "First name is required"),
//     lastName: (schema) => schema.lastName.min(1, "Last name is required"),
//     address1: (schema) => schema.address1.min(1, "Address is required"),
//     city: (schema) => schema.city.min(1, "City is required"),
//     state: (schema) => schema.state.length(2, "State must be exactly 2 characters"),
//     email: (schema) => schema.email.email("Invalid email address"),
//     zip: (schema) => schema.zip.regex(/^\d{5}(-\d{4})?$/, "Invalid Zip code. Use 5 digits or 5 digits followed by a hyphen and 4 digits"),
//     phone: (schema) => schema.phone.regex(/^\d{3}-\d{3}-\d{4}$/, "Invalid phone number format. Use XXX-XXX-XXXX"),
// });
export const insertCustomerSchema = createInsertSchema(customers, {
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    address1: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().length(2, "State must be exactly 2 characters"),
    email: z.string().email("Invalid email address"),
    zip: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid Zip code. Use 5 digits or 5 digits followed by a hyphen and 4 digits"),
    phone: z.string().regex(/^\d{3}-\d{3}-\d{4}$/, "Invalid phone number format. Use XXX-XXX-XXXX"),
});

export const selectCustomerSchema = createSelectSchema(customers)

export type insertCustomerSchemaType = typeof insertCustomerSchema._type;

export type selectCustomerSchemaType = typeof selectCustomerSchema._type; 