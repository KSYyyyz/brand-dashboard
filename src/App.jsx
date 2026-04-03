import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { DateRangeProvider } from './context/DateRangeContext'
import { DataProvider } from './context/DataContext'
import OverviewPage from './features/overview/OverviewPage'
import UsersPage from './features/users/UsersPage'
import OperationsPage from './features/operations/OperationsPage'
import StoresPage from './features/stores/StoresPage'
import MembersPage from './features/members/MembersPage'
import ProductsPage from './features/products/ProductsPage'
import OrdersPage from './features/orders/OrdersPage'
import AftersalesPage from './features/aftersales/AftersalesPage'
import DataManagementPage from './features/data/DataManagementPage'

const navItems = [
  { path: '/', label: '数据概览' },
  { path: '/users', label: '用户画像' },
  { path: '/members', label: '会员管理' },
  { path: '/products', label: '商品管理' },
  { path: '/orders', label: '订单管理' },
  { path: '/aftersales', label: '售后管理' },
  { path: '/operations', label: '运营分析' },
  { path: '/stores', label: '门店管理' },
  { path: '/data', label: '数据管理' }
]

function Sidebar() {
  const location = useLocation()

  return (
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
              className={`flex items-center px-3 py-2 rounded-lg mb-1 transition-colors ${
                isActive
                  ? 'bg-accent/20 text-accent'
                  : 'text-textSecondary hover:bg-secondary/80 hover:text-textPrimary'
              }`}
            >
              <span className="text-sm">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* 底部 */}
      <div className="p-4 border-t border-border text-xs text-textSecondary">
        MVP v0.0.2
      </div>
    </aside>
  )
}

export default function App() {
  return (
    <HashRouter>
      <DataProvider>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<OverviewPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/members" element={<MembersPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/aftersales" element={<AftersalesPage />} />
              <Route path="/operations" element={<OperationsPage />} />
              <Route path="/stores" element={<StoresPage />} />
              <Route path="/data" element={<DataManagementPage />} />
            </Routes>
          </main>
        </div>
      </DataProvider>
    </HashRouter>
  )
}
