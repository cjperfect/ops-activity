import { ArrowUpRight, CalendarRange, MoreHorizontal, Plus, Search } from 'lucide-react'
import { useState } from 'react'

import { SiteHeader } from '@/components/layout/site-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

import { ActivityConfigDialog } from './activity-config-dialog'
import { MOCK_ACTIVITY_LIST } from './mock-data'
import type { ActivityListItem } from './types'

const STATUS_META = {
  DRAFT: { label: '草稿', className: 'bg-muted text-muted-foreground' },
  REVIEW: { label: '待审核', className: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' },
  ONLINE: { label: '进行中', className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' },
  OFFLINE: { label: '已下线', className: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-400' },
} as const

const TYPE_LABEL: Record<number, string> = { 1: '仅抽奖', 2: '仅兑换', 3: '抽奖+兑换' }

/** 2026-11-20T00:00 → 11-20 00:00 */
const shortTime = (iso: string) => `${iso.slice(5, 10)} ${iso.slice(11, 16)}`

export function ActivityListPage() {
  /** 当前打开配置弹窗的活动；null 表示弹窗关闭 */
  const [active, setActive] = useState<ActivityListItem | null>(null)

  return (
    <>
      <SiteHeader
        breadcrumb={[{ label: '活动运营' }, { label: '活动配置' }]}
        actions={
          <Button size="sm" className="gap-1.5 text-[13px]" onClick={() => setActive(MOCK_ACTIVITY_LIST[0])}>
            <Plus className="size-3.5" />
            新建活动
          </Button>
        }
      />

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[1200px] px-4 py-5 lg:px-6">
          <div className="mb-4">
            <h1 className="text-xl font-semibold tracking-tight">活动配置</h1>
            <p className="text-muted-foreground mt-1 text-[13px]">
              共 {MOCK_ACTIVITY_LIST.length} 场活动，点击任意一行打开配置弹窗。活动编码创建后不可变更。
            </p>
          </div>

          {/* 搜索与筛选 */}
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <div className="relative w-full max-w-xs">
              <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
              <Input placeholder="搜索活动名称或编码" className="h-8 pl-8 text-[13px]" />
            </div>
            <Badge variant="secondary" className="h-7 px-2 text-[12px] font-normal">
              全部状态
            </Badge>
            <Badge variant="outline" className="h-7 px-2 text-[12px] font-normal">
              全部渠道
            </Badge>
          </div>

          <Card className="overflow-hidden py-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-[13px]">
                <thead>
                  <tr className="bg-muted/50 text-muted-foreground border-b text-left text-[11px]">
                    <th className="px-4 py-2.5 font-medium">活动</th>
                    <th className="px-4 py-2.5 font-medium">状态</th>
                    <th className="px-4 py-2.5 font-medium">活动时间</th>
                    <th className="px-4 py-2.5 text-right font-medium">参与 UV</th>
                    <th className="px-4 py-2.5 text-right font-medium">抽奖次数</th>
                    <th className="px-4 py-2.5 font-medium">负责人</th>
                    <th className="px-4 py-2.5 text-right font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_ACTIVITY_LIST.map((a) => (
                    <tr
                      key={a.code}
                      className="hover:bg-accent/40 cursor-pointer border-b transition-colors last:border-0"
                      onClick={() => setActive(a)}
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium">{a.name}</div>
                        <div className="text-muted-foreground mt-0.5 flex items-center gap-1.5 font-mono text-[11px]">
                          {a.code}
                          <span className="font-sans">·</span>
                          <span className="font-sans">{TYPE_LABEL[a.activityType]}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" className={cn('text-[11px] font-normal', STATUS_META[a.status].className)}>
                          {STATUS_META[a.status].label}
                        </Badge>
                      </td>
                      <td className="text-muted-foreground px-4 py-3 text-[12px] tabular-nums">
                        <div className="flex items-center gap-1">
                          <CalendarRange className="size-3.5" />
                          {shortTime(a.startTime)} ~ {shortTime(a.endTime)}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">{a.uv ? a.uv.toLocaleString() : '—'}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{a.draws ? a.draws.toLocaleString() : '—'}</td>
                      <td className="text-muted-foreground px-4 py-3 text-[12px]">{a.owner}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 gap-1 text-[12px]"
                            onClick={(e) => {
                              e.stopPropagation()
                              setActive(a)
                            }}
                          >
                            配置
                            <ArrowUpRight className="size-3" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              render={
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-7"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreHorizontal className="size-4" />
                                </Button>
                              }
                            />
                            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                              <DropdownMenuItem className="text-[13px]">复制活动</DropdownMenuItem>
                              <DropdownMenuItem className="text-[13px]">查看数据</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive text-[13px]">下线</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>

      {/* 配置向导：弹窗形式，不再单独占一个页面 */}
      <ActivityConfigDialog activity={active} onClose={() => setActive(null)} />
    </>
  )
}
