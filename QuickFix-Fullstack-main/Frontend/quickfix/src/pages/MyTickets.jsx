import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import PageHeader from '../components/common/PageHeader.jsx';
import TicketTable from '../components/tickets/TicketTable.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useTickets } from '../context/TicketContext.jsx';
export default function MyTickets() {
  const { user } = useAuth(); const { tickets } = useTickets();
  const mine = tickets.filter((t) => t.requesterId === user.id || t.assigneeId === user.id);
  return (<>
    <PageHeader title="My tickets" subtitle="Tickets you reported or are assigned to">
      <Link to="/tickets/new" className="btn btn-primary"><Plus size={18} />New ticket</Link>
    </PageHeader>
    <TicketTable tickets={mine} exportName="my-tickets" />
  </>);
}
