import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
export const PALETTE = ['#8054A4', '#A477D1', '#D77AC8', '#C7A3ED', '#86A88B', '#D9A15B', '#8D9EB6', '#C75D70'];
export const PRIORITY_COLORS = { Low: '#8D9EB6', Medium: '#A477D1', High: '#D9A15B', Critical: '#C75D70' };
const AX = { stroke: '#91869B', tick: { fill: '#B7ACBF', fontSize: 12 }, tickLine: false, axisLine: { stroke: '#493B52' } };
const TIP = { contentStyle: { background: '#33203F', border: '1px solid #493B52', borderRadius: 10, color: '#F3EDF8' }, labelStyle: { color: '#C7A3ED' }, itemStyle: { color: '#F3EDF8' }, cursor: { fill: 'rgba(164,119,209,.10)' } };
const LEG = { wrapperStyle: { color: '#B7ACBF', fontSize: 12 } };

export function ChartCard({ title, empty, children }) {
  return (<section className="card"><h2>{title}</h2><div className="chart" role="img" aria-label={title}>{empty ? <p className="sub" style={{ paddingTop: 80, textAlign: 'center' }}>No data for this selection.</p> : children}</div></section>);
}
export function VolumeChart({ data }) {
  return (<ResponsiveContainer width="100%" height="100%"><AreaChart data={data} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
    <defs><linearGradient id="gc" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#A477D1" stopOpacity={0.45} /><stop offset="100%" stopColor="#A477D1" stopOpacity={0} /></linearGradient></defs>
    <CartesianGrid stroke="#493B52" vertical={false} /><XAxis dataKey="day" {...AX} /><YAxis allowDecimals={false} {...AX} /><Tooltip {...TIP} /><Legend {...LEG} />
    <Area type="monotone" dataKey="Created" stroke="#A477D1" strokeWidth={2} fill="url(#gc)" /><Area type="monotone" dataKey="Resolved" stroke="#86A88B" strokeWidth={2} fill="none" />
  </AreaChart></ResponsiveContainer>);
}
export function BarsChart({ data, colors = {} }) {
  return (<ResponsiveContainer width="100%" height="100%"><BarChart data={data} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
    <CartesianGrid stroke="#493B52" vertical={false} /><XAxis dataKey="name" {...AX} /><YAxis allowDecimals={false} {...AX} /><Tooltip {...TIP} />
    <Bar dataKey="value" radius={[6, 6, 0, 0]}>{data.map((d, i) => <Cell key={d.name} fill={colors[d.name] || PALETTE[i % PALETTE.length]} />)}</Bar>
  </BarChart></ResponsiveContainer>);
}
export function DonutChart({ data }) {
  return (<ResponsiveContainer width="100%" height="100%"><PieChart>
    <Pie data={data} dataKey="value" nameKey="name" innerRadius={52} outerRadius={82} paddingAngle={2} stroke="#292230">{data.map((d, i) => <Cell key={d.name} fill={PALETTE[i % PALETTE.length]} />)}</Pie>
    <Tooltip {...TIP} /><Legend {...LEG} />
  </PieChart></ResponsiveContainer>);
}
