import { useState } from 'react';
import PageHeader from '../components/common/PageHeader.jsx';
import TicketTable from '../components/tickets/TicketTable.jsx';
import { useTickets } from '../context/TicketContext.jsx';
import { getSlaState } from '../utils/slaUtils.js';

const VIEWS = {
  All: () => true,
  Open: (t) => t.status !== 'Resolved',
  Escalated: (t) => t.status === 'Escalated',
  Breached: (t) => getSlaState(t) === 'Breached' && t.status !== 'Resolved',
  Resolved: (t) => t.status === 'Resolved',
};
export default function AllIncidents() {
  const { tickets } = useTickets();
  const [view, setView] = useState('Open');
  return (<>
    <PageHeader title="All incidents" subtitle="Every ticket across the organisation (demo data)" />
    <div className="tabs" role="tablist">
      {Object.entries(VIEWS).map(([name, fn]) => (
        <button key={name} role="tab" aria-selected={view === name} className={`tab${view === name ? ' on' : ''}`} onClick={() => setView(name)}>
          {name}<span className="count">{tickets.filter(fn).length}</span>
        </button>))}
    </div>
    <TicketTable tickets={tickets.filter(VIEWS[view])} showAssignee exportName={`incidents-${view.toLowerCase()}`} />
  </>);
}
