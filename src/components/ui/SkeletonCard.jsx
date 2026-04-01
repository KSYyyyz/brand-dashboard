export default function SkeletonCard({ height = 'h-32' }) {
  return (
    <div className={`bg-secondary rounded-lg border border-border p-4 animate-pulse ${height}`}>
      <div className="h-4 bg-border rounded w-1/3 mb-3"></div>
      <div className="h-8 bg-border rounded w-1/2"></div>
    </div>
  )
}
