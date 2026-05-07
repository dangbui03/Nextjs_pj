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
  const { searchText = "" } = await searchParams;
  const trimmedSearchText = searchText.trim();
  const results = trimmedSearchText
    ? await getTicketSearchResults(trimmedSearchText)
    : await getOpenTickets();

  return <TicketTable data={results} searchText={trimmedSearchText} />;
}
