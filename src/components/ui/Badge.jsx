const badgeStyles = {
  default: 'bg-secondary text-textSecondary',
  success: 'bg-success/20 text-success',
  warning: 'bg-warning/20 text-warning',
  error: 'bg-error/20 text-error',
  accent: 'bg-accent/20 text-accent'
}

export default function Badge({ children, variant = 'default' }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${badgeStyles[variant]}`}>
      {children}
    </span>
  )
}
