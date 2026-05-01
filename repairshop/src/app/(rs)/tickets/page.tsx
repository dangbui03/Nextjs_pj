import TicketSearch from "@/app/(rs)/tickets/TicketSearch";
import { getOpenTickets } from "@/lib/queries/getOpenTickets";
import { getTicketSearchResults } from "@/lib/queries/getTicketSearchResults";
import TicketTable from "@/app/(rs)/tickets/TicketTable";

export const metadata = {
  title: "Tickets Search",
};

export default async function Tickets({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { searchText } = await searchParams;

  if (!searchText) {
    // Query default results
    const results = await getOpenTickets();

    return (
      <>
        <TicketSearch />
        {results.length ? <TicketTable data={results} /> : <p>No open tickets found.</p>}
      </>
    );
  }

  // Query search results
  const results = await getTicketSearchResults(searchText);

  // Return search results
  return (
    <>
      <TicketSearch />
      {results.length ? <TicketTable data={results} /> : <p>No open tickets found.</p>}
    </>
  );
}
