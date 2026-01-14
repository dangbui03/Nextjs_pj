"use server"

import { eq, sql } from "drizzle-orm";
import { flattenValidationErrors } from "next-safe-action";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { customers } from "@/db/schema";
import { actionClient } from "@/lib/safe-action";
import { insertCustomerSchema, type insertCustomerSchemaType } from "@/zod-schemas/customer";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export const saveCustomerAction = actionClient
    .metadata({
        actionName: "saveCustomerAction",
    })
    .schema(insertCustomerSchema, {
        handleValidationErrorsShape: async (ve) => flattenValidationErrors(ve).fieldErrors,
    }) // validate the input against the schema
    .action(async ({
        parsedInput: customer
    } : { parsedInput: insertCustomerSchemaType }) => {
        const { isAuthenticated } = getKindeServerSession();

        const isAuth = await isAuthenticated();

        if (!isAuth) redirect("/login"); 

        const query = sql.raw(`SELECT * FROM Dang`);
        const data = await db.execute(query);

        // New customer
        if (customer.id === 0) {
            const result = await db.insert(customers).values({
                firstName: customer.firstName,
                lastName: customer.lastName,
                email: customer.email,
                phone: customer.phone,
                address1: customer.address1,
                ...(customer.address2?.trim() ? { address2: customer.address2 } : {}),
                city: customer.city,
                state: customer.state,
                zip: customer.zip,
                ...(customer.notes?.trim() ? { notes: customer.notes } : {}),
            }).returning({ insertedId: customers.id });
            
            return {
                message: `Customer ID #${result[0].insertedId} created successfully.`,
            }
        }

        // Existing customer
        const result = await db.update(customers)
            .set({
                firstName: customer.firstName,
                lastName: customer.lastName,
                email: customer.email,
                phone: customer.phone,
                address1: customer.address1,
                address2: customer.address2?.trim() ?? null,
                city: customer.city,
                state: customer.state,
                zip: customer.zip,
                notes: customer.notes?.trim() ?? null,
            })
            .where(eq(customers.id, customer.id!))
            .returning({ updatedId: customers.id });
        
        return {
            message: `Customer ID #${result[0].updatedId} updated successfully.`,
        }
    })