import { ChevronRight, Gift, Sparkles, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { cn } from '@/lib/utils'

import { useSidebar } from './sidebar-context'

/** 侧边栏导航项：当前只保留「活动配置」一个入口 */
const NAV_GROUPS = [
  {
    label: '活动运营',
    items: [{ to: '/', label: '活动配置', icon: Sparkles }],
  },
]

/** 导航主体，桌面侧栏与窄屏浮层共用一份 */
function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      <div className="flex h-14 items-center gap-2.5 border-b border-sidebar-border px-4">
        <div className="from-primary to-primary/60 flex size-8 items-center justify-center rounded-lg bg-gradient-to-br">
          <Gift className="text-primary-foreground size-4" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold tracking-tight">运营活动后台</div>
          <div className="text-muted-foreground text-[11px]">Activity Console</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-5">
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      'group flex items-center gap-2.5 rounded-md px-2 py-2 text-[13px] transition-colors',
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                        : 'text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground',
                    )
                  }
                >
                  <item.icon className="size-4 shrink-0" />
                  <span className="flex-1 truncate">{item.label}</span>
                  <ChevronRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-60" />
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-sidebar-border border-t p-3">
        <div className="flex items-center gap-2.5 rounded-md px-2 py-1.5">
          <div className="bg-muted text-muted-foreground flex size-7 items-center justify-center rounded-full text-[11px] font-semibold">
            CJ
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <div className="truncate text-[13px] font-medium">陈江</div>
            <div className="text-muted-foreground truncate text-[11px]">运营 · 完全访问</div>
          </div>
        </div>
      </div>
    </>
  )
}

/** 侧边栏：桌面固定，窄屏为浮层（不挤压内容区） */
export function AppSidebar() {
  const { open, setOpen } = useSidebar()

  return (
    <>
      <aside className="border-sidebar-border bg-sidebar text-sidebar-foreground hidden h-svh w-64 shrink-0 flex-col border-r md:flex">
        <SidebarBody />
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="bg-sidebar text-sidebar-foreground relative flex h-full w-64 flex-col border-r shadow-xl">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:bg-accent absolute top-3 right-3 z-10 rounded p-1"
              aria-label="关闭导航"
            >
              <X className="size-4" />
            </button>
            <SidebarBody onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}
    </>
  )
}
