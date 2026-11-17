import { ChevronRight, Menu, Moon, Smartphone, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { useSidebar } from './sidebar-context'
import { cn } from '@/lib/utils'

interface Crumb {
  label: string
  to?: string
}

interface SiteHeaderProps {
  breadcrumb: Crumb[]
  actions?: React.ReactNode
}

/** 顶栏：面包屑 + 主题切换 + 预览入口，右侧由页面注入主操作按钮 */
export function SiteHeader({ breadcrumb, actions }: SiteHeaderProps) {
  const [dark, setDark] = useState(false)
  const { setOpen } = useSidebar()

  // 简单的明暗主题切换，状态只存在当前会话
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/70 sticky top-0 z-30 border-b backdrop-blur">
      <div className="flex h-14 items-center gap-3 px-4 lg:px-6">
        {/* 窄屏导航入口 */}
        <Button
          variant="ghost"
          size="icon"
          className="size-8 md:hidden"
          onClick={() => setOpen(true)}
          aria-label="打开导航"
        >
          <Menu className="size-4" />
        </Button>

        {/* 面包屑 */}
        <nav className="text-muted-foreground flex min-w-0 items-center gap-1 text-[13px]">
          {breadcrumb.map((c, i) => (
            <span key={`${c.label}-${i}`} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="size-3.5 opacity-50" />}
              {c.to ? (
                <Link to={c.to} className="hover:text-foreground truncate transition-colors">
                  {c.label}
                </Link>
              ) : (
                <span className={cn('truncate', i === breadcrumb.length - 1 && 'text-foreground font-medium')}>
                  {c.label}
                </span>
              )}
            </span>
          ))}
        </nav>

        <div className="flex-1" />

        {/* 右侧操作区 */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-muted-foreground hidden gap-1.5 text-[13px] lg:inline-flex">
            <Smartphone className="size-4" />
            预览小程序
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => setDark((v) => !v)}
            aria-label="切换主题"
          >
            {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
          {actions}
        </div>
      </div>
    </header>
  )
}
