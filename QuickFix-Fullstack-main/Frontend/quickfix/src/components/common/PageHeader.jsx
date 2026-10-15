export default function PageHeader({ title, subtitle, children }) {
  return (<div className="page-head"><div><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div><div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{children}</div></div>);
}
