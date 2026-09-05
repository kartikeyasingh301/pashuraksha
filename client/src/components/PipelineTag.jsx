const STATUS_CONFIG = {
  REPORT: { label: 'Report', className: 'tag-report' },
  CASE: { label: 'Case', className: 'tag-case' },
  CLUSTER: { label: 'Cluster', className: 'tag-cluster' },
  SUSPECTED_OUTBREAK: { label: 'Suspected Outbreak', className: 'tag-outbreak' },
  RESPONSE: { label: 'Response', className: 'tag-response' },
  CONFIRMED: { label: 'Confirmed', className: 'tag-confirmed' },
  PENDING: { label: 'Pending', className: 'tag-report' },
  ACTIVE: { label: 'Active', className: 'tag-case' },
  RESOLVED: { label: 'Resolved', className: 'tag-confirmed' },
};

export default function PipelineTag({ status }) {
  const config = STATUS_CONFIG[status] || { label: status, className: 'tag-report' };
  return <span className={`pipeline-tag ${config.className}`}>{config.label}</span>;
}