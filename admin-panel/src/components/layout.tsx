// Layout.tsx
import { ReactNode, FC } from 'react'
import Sidebar from './sidebar'
import Navbar from './header'
import Footer from './footer'
import { Outlet } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'

const Layout: FC<{ children: ReactNode }> = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="flex-1 overflow-auto">
          <div className="mx-auto p-6">
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default Layout
