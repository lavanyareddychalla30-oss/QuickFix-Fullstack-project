import { useState } from 'react';
import { Download } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeader from '../components/common/PageHeader.jsx';
import { ChartCard, VolumeChart, BarsChart, DonutChart, PRIORITY_COLORS } from '../components/charts/ChartKit.jsx';
import { useTickets } from '../context/TicketContext.jsx';
import { countBy, inRange, volumeByDay, avgResolutionHours } from '../utils/reportUtils.js';
import { slaCompliance } from '../utils/slaUtils.js';
import { downloadCSV, userName } from '../utils/ticketUtils.js';
import { PRIORITIES } from '../data/seedData.js';

export default function Reports() {
  const { tickets } = useTickets();
  const [days, setDays] = useState(30);
  const now = Date.now();
  const list = inRange(tickets, days, now);
  const resolved = list.filter((t) => t.status === 'Resolved');
  const open = list.filter((t) => t.status !== 'Resolved');
  const rate = list.length ? Math.round((resolved.length / list.length) * 100) : 0;
  const work = countBy(open.filter((t) => t.assigneeId), (t) => userName(t.assigneeId));
  const exportCsv = () => (list.length && downloadCSV('quickfix-report', list) ? toast.success(`Exported ${list.length} tickets`) : toast.error(list.length ? 'Export failed' : 'Nothing to export'));
  const kpi = [['Total incidents', list.length], ['Resolution rate', `${rate}%`], ['Avg resolution', `${avgResolutionHours(list).toFixed(1)}h`], ['SLA compliance', `${slaCompliance(list, now)}%`]];
  return (<>
    <PageHeader title="Reports & analytics" subtitle="Calculated from the demo dataset">
      <select className="select-sm" aria-label="Date range" value={days} onChange={(e) => setDays(Number(e.target.value))}>
        <option value={7}>Last 7 days</option><option value={30}>Last 30 days</option><option value={90}>Last 90 days</option><option value={0}>All time</option></select>
      <button className="btn btn-secondary" onClick={exportCsv}><Download size={15} />Export CSV</button>
    </PageHeader>
    <div className="grid-stats">{kpi.map(([l, v]) => <div key={l} className="card stat"><span className="l">{l}</span><span className="v">{v}</span></div>)}</div>
    <div className="grid-2">
      <ChartCard title="Created vs resolved" empty={!list.length}><VolumeChart data={volumeByDay(list, Math.min(days || 30, 14))} /></ChartCard>
      <ChartCard title="Open vs resolved" empty={!list.length}><DonutChart data={countBy(list, (t) => (t.status === 'Resolved' ? 'Resolved' : 'Open'))} /></ChartCard>
      <ChartCard title="Tickets by category" empty={!list.length}><BarsChart data={countBy(list, 'category')} /></ChartCard>
      <ChartCard title="Tickets by priority" empty={!list.length}><BarsChart data={PRIORITIES.map((name) => ({ name, value: list.filter((t) => t.priority === name).length }))} colors={PRIORITY_COLORS} /></ChartCard>
      <ChartCard title="Agent workload (open tickets)" empty={!work.length}><BarsChart data={work} /></ChartCard>
    </div>
  </>);
}
