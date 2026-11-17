import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { AppSidebar } from '@/components/layout/app-sidebar'
import { SidebarContext } from '@/components/layout/sidebar-context'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ActivityListPage } from '@/features/activity/activity-list-page'

/** 应用外壳：左侧导航固定，右侧内容区独立滚动 */
export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <BrowserRouter>
      <TooltipProvider delay={200}>
        <SidebarContext.Provider value={{ open: sidebarOpen, setOpen: setSidebarOpen }}>
          <div className="bg-background flex h-svh overflow-hidden">
            <AppSidebar />
            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
              <Routes>
                <Route path="/" element={<ActivityListPage />} />
                <Route path="*" element={<ActivityListPage />} />
              </Routes>
            </div>
          </div>
        </SidebarContext.Provider>
        <Toaster position="top-center" richColors />
      </TooltipProvider>
    </BrowserRouter>
  )
}
