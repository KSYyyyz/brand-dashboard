export default function Card({ title, children, className = '' }) {
  return (
    <div className={`bg-secondary rounded-lg border border-border p-4 ${className}`}>
      {title && <h3 className="text-lg font-medium mb-4 text-textPrimary">{title}</h3>}
      {children}
    </div>
  )
}
