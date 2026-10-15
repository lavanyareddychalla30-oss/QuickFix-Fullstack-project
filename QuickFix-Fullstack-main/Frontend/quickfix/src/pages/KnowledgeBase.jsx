import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Search, ThumbsUp, ThumbsDown, BookOpen, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeader from '../components/common/PageHeader.jsx';
import NotFound from './NotFound.jsx';
import { listArticles } from '../services/knowledgeBaseService.js';
import { loadJSON, saveJSON } from '../utils/storage.js';

function Article({ a, all }) {
  const [votes, setVotes] = useState(() => loadJSON('qf_kb_votes', {}));
  const vote = (v) => { const n = { ...votes, [a.id]: v }; setVotes(n); saveJSON('qf_kb_votes', n); toast.success('Thanks for the feedback'); };
  const related = all.filter((x) => x.category === a.category && x.id !== a.id);
  return (<>
    <Link to="/knowledge-base" className="back"><ArrowLeft size={15} />All articles</Link>
    <article className="card kb-article"><span className="badge b-info">{a.category}</span><h1>{a.title}</h1><p className="sub">Updated {a.updated}</p>
      <p className="lead">{a.summary}</p><ol>{a.steps.map((s) => <li key={s}>{s}</li>)}</ol>
      <div className="vote"><span>Was this helpful?</span>
        <button className={`btn btn-secondary${votes[a.id] === 'up' ? ' picked' : ''}`} onClick={() => vote('up')} aria-pressed={votes[a.id] === 'up'}><ThumbsUp size={15} />Yes</button>
        <button className={`btn btn-secondary${votes[a.id] === 'down' ? ' picked' : ''}`} onClick={() => vote('down')} aria-pressed={votes[a.id] === 'down'}><ThumbsDown size={15} />No</button></div></article>
    {related.length > 0 && <section className="card" style={{ marginTop: 16 }}><h2>Related articles</h2>{related.map((r) => <p key={r.id}><Link className="row-link" to={`/knowledge-base/${r.id}`}>{r.title}</Link></p>)}</section>}
  </>);
}

export default function KnowledgeBase() {
  const { id } = useParams();
  const [all, setAll] = useState(null);
  const [q, setQ] = useState(''); const [cat, setCat] = useState('');
  useEffect(() => { listArticles().then(setAll).catch(() => setAll([])); }, []);
  if (!all) return <div className="card skeleton" style={{ height: 160 }} aria-busy="true" />;
  if (id) { const a = all.find((x) => x.id === id); return a ? <Article a={a} all={all} /> : <NotFound />; }
  const cats = [...new Set(all.map((a) => a.category))];
  const s = q.trim().toLowerCase();
  const shown = all.filter((a) => (!cat || a.category === cat) && (!s || `${a.title} ${a.summary}`.toLowerCase().includes(s)));
  return (<>
    <PageHeader title="Knowledge base" subtitle="Fix common problems yourself, or find out what to include in a ticket." />
    <div className="toolbar" style={{ padding: '0 0 16px', border: 0 }}>
      <div className="search"><Search size={16} aria-hidden="true" /><label className="sr-only" htmlFor="kb-q">Search articles</label><input id="kb-q" className="input" style={{ paddingLeft: 36 }} placeholder="Search articles" value={q} onChange={(e) => setQ(e.target.value)} /></div>
    </div>
    <div className="tabs"><button className={`tab${!cat ? ' on' : ''}`} onClick={() => setCat('')}>All</button>{cats.map((c) => <button key={c} className={`tab${cat === c ? ' on' : ''}`} onClick={() => setCat(c)}>{c}</button>)}</div>
    {shown.length ? <div className="grid-3">{shown.map((a) => (
      <Link key={a.id} to={`/knowledge-base/${a.id}`} className="card kb-card"><BookOpen size={18} color="var(--color-lilac)" aria-hidden="true" /><h2>{a.title}</h2><p className="sub">{a.summary}</p><span className="badge b-neutral">{a.category}</span></Link>))}</div>
      : <div className="card empty"><p>No articles match "{q}". Try a different word or raise a ticket.</p></div>}
  </>);
}
