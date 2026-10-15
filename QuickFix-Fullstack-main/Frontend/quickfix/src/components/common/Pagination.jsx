import { ChevronLeft, ChevronRight } from 'lucide-react';
export default function Pagination({ page, pages, total, onPage }) {
  return (
    <div className="pager">
      <span>{total} result{total === 1 ? '' : 's'} · Page {page} of {pages}</span>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn btn-secondary" disabled={page <= 1} onClick={() => onPage(page - 1)} aria-label="Previous page"><ChevronLeft size={16} /></button>
        <button className="btn btn-secondary" disabled={page >= pages} onClick={() => onPage(page + 1)} aria-label="Next page"><ChevronRight size={16} /></button>
      </div>
    </div>
  );
}
