export default function SyncBadge({ count }) {
  if (!count || count === 0) return null;
  return <span className="sync-badge">{count}</span>;
}