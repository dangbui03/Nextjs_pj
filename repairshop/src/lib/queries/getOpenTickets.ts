import { db } from "@/db";
import { tickets, customers } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getOpenTickets() {
    const results = await db.select({
        ticketDate: tickets.createdAt,
        title: tickets.title,
        firstName: customers.firstName,
        lastName: customers.lastName,
        email: customers.email,
        tech: tickets.tech,
    })
        .from(tickets)
        .leftJoin(customers, eq(tickets.customerId, customers.id))
        .where(eq(tickets.completed, false));
    
    return results;
}