import { CircleDot, Circle, Loader, ArrowUpRight, CheckCircle2, ShieldCheck, AlertTriangle, ShieldAlert, Flame, ChevronUp, Minus, ChevronDown } from 'lucide-react';
const Pill = ({ cls, Icon, children }) => <span className={`badge ${cls}`}><Icon size={12} aria-hidden="true" />{children}</span>;
const ST = { New: ['b-info', CircleDot], Assigned: ['b-neutral', Circle], 'In Progress': ['b-info', Loader], Escalated: ['b-danger', ArrowUpRight], Resolved: ['b-success', CheckCircle2] };
const PR = { Critical: ['b-danger', Flame], High: ['b-warning', ChevronUp], Medium: ['b-info', Minus], Low: ['b-neutral', ChevronDown] };
const SL = { Healthy: ['b-success', ShieldCheck], Met: ['b-success', ShieldCheck], 'At risk': ['b-warning', AlertTriangle], Breached: ['b-danger', ShieldAlert] };
const mk = (map) => ({ value }) => { const [cls, Icon] = map[value] || ['b-neutral', Circle]; return <Pill cls={cls} Icon={Icon}>{value}</Pill>; };
export const StatusBadge = mk(ST);
export const PriorityBadge = mk(PR);
export const SLABadge = mk(SL);
