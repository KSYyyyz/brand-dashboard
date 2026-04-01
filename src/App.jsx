import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import OverviewPage from './features/overview/OverviewPage'
import UsersPage from './features/users/UsersPage'
import OperationsPage from './features/operations/OperationsPage'
import StoresPage from './features/stores/StoresPage'
import DataManagementPage from './features/data/DataManagementPage'

const navItems = [
  { path: '/', label: '数据概览', icon: '📊' },
  { path: '/users', label: '用户画像', icon: '👥' },
  { path: '/operations', label: '运营分析', icon: '📈' },
  { path: '/stores', label: '门店管理', icon: '🏪' },
  { path: '/data', label: '数据管理', icon: '⚙️' }
]

function Layout({ children }) {
  const location = useLocation()

  return (
    <div className="flex min-h-screen">
      {/* 侧边栏 */}
      <aside className="w-56 bg-secondary border-r border-border flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-border">
          <h1 className="text-lg font-bold text-accent">闻献数据中台</h1>
          <p className="text-xs text-textSecondary mt-1">品牌数据智能平台</p>
        </div>

        {/* 导航 */}
        <nav className="flex-1 p-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-1 transition-colors ${
                  isActive
                    ? 'bg-accent/20 text-accent'
                    : 'text-textSecondary hover:bg-secondary/80 hover:text-textPrimary'
                }`}
              >
                <span>{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* 底部 */}
        <div className="p-4 border-t border-border text-xs text-textSecondary">
          MVP v0.0.1
        </div>
      </aside>

      {/* 主内容 */}
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/operations" element={<OperationsPage />} />
          <Route path="/stores" element={<StoresPage />} />
          <Route path="/data" element={<DataManagementPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
