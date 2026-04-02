import { useData } from '../../context/DataContext'

export default function RefreshButton() {
  const { refresh, loading, lastRefresh } = useData()

  return (
    <button
      onClick={refresh}
      disabled={loading}
      className="px-3 py-2 bg-accent text-primary rounded-lg text-sm font-medium hover:bg-accentLight disabled:opacity-50 flex items-center gap-2"
    >
      <svg
        className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      {loading ? '刷新中...' : '刷新数据'}
    </button>
  )
}
