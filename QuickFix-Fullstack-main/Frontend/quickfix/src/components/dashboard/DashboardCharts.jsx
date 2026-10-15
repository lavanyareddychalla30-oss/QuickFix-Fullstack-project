import { ChartCard, VolumeChart, BarsChart, DonutChart, PRIORITY_COLORS } from '../charts/ChartKit.jsx';
import { countBy, volumeByDay } from '../../utils/reportUtils.js';
import { PRIORITIES } from '../../data/seedData.js';
export default function DashboardCharts({ tickets }) {
  const vol = volumeByDay(tickets, 7);
  const pri = PRIORITIES.map((name) => ({ name, value: tickets.filter((t) => t.priority === name).length }));
  const st = countBy(tickets, 'status');
  return (<div className="grid-3">
    <ChartCard title="Ticket volume (7 days)" empty={!tickets.length}><VolumeChart data={vol} /></ChartCard>
    <ChartCard title="Tickets by priority" empty={!tickets.length}><BarsChart data={pri} colors={PRIORITY_COLORS} /></ChartCard>
    <ChartCard title="Status distribution" empty={!tickets.length}><DonutChart data={st} /></ChartCard>
  </div>);
}
