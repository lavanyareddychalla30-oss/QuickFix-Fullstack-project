import { Zap } from 'lucide-react';
export default function Logo({ showName = true }) {
  return (
    <div className="brand">
      <span className="logo-mark" aria-hidden="true"><Zap size={21} strokeWidth={2.4} /></span>
      {showName && <span className="brand-name">QuickFix</span>}
    </div>
  );
}
