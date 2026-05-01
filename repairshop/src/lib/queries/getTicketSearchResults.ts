import { db } from "@/db";
import { tickets, customers } from "@/db/schema";
import { eq, ilike, or, sql, asc } from "drizzle-orm";

export async function getTicketSearchResults(searchText: string) {
  const results = await db
    .select({
      id: tickets.id,
      ticketDate: tickets.createdAt,
      title: tickets.title,
      firstName: customers.firstName,
      lastName: customers.lastName,
      email: customers.email,
      tech: tickets.tech,
      completed: tickets.completed,
    })
    .from(tickets)
    .leftJoin(customers, eq(tickets.customerId, customers.id))
    .where(
      or(
        ilike(tickets.title, `%${searchText}%`),
        // ilike(tickets.description, `%${searchText}%`),
        ilike(tickets.tech, `%${searchText}%`),
        // ilike(customers.firstName, `%${searchText}%`),
        // ilike(customers.lastName, `%${searchText}%`),
        ilike(customers.email, `%${searchText}%`),
        ilike(customers.phone, `%${searchText}%`),
        // ilike(customers.address1, `%${searchText}%`),
        // ilike(customers.address2, `%${searchText}%`),
        ilike(customers.city, `%${searchText}%`),
        // ilike(customers.state, `%${searchText}%`),
        ilike(customers.zip, `%${searchText}%`),
        sql`lower(concat(${customers.firstName}, ' ', ${customers.lastName})) LIKE ${`%${searchText.toLowerCase().replace(' ', '%')}%`}`,
      ),
    )
    .orderBy(asc(tickets.createdAt));

  return results;
}

export type TicketSearchResultsType = Awaited<ReturnType<typeof getTicketSearchResults>>;