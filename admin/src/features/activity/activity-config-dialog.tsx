import { ChevronLeft, ChevronRight, Clock, Send, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

import { createConfigFromList, INITIAL_ACTIVITY } from './mock-data'
import type { ActivityConfig, ActivityListItem, ActivityPrize } from './types'
import { StepNav } from './components/step-nav'
import { BasicInfoStep } from './steps/basic-info-step'
import { PrizePoolStep } from './steps/prize-pool-step'
import { WEIGHT_BASE, durationDays, totalWeight } from './lib'

/** 只有两步：活动信息（含分享）→ 两个奖品列表 */
const STEPS = [
  { label: '基本信息', desc: '编码 / 名称 / 时间 / 分享' },
  { label: '奖品列表', desc: '抽奖奖品 / 兑换奖品' },
]

const STATUS_META = {
  DRAFT: { label: '草稿', className: 'bg-muted text-muted-foreground' },
  REVIEW: { label: '待审核', className: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' },
  ONLINE: { label: '进行中', className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' },
} as const

interface ActivityConfigDialogProps {
  /** 当前要配置的活动，null 表示弹窗关闭 */
  activity: ActivityListItem | null
  onClose: () => void
}

/**
 * 活动配置弹窗：两步向导装在一个大弹窗里
 * - 头部固定（名称 / 状态 / 元信息 + 保存与提交）
 * - 中部内容区独立滚动，步骤条常驻可见
 * - 底部步骤导航固定
 */
export function ActivityConfigDialog({ activity, onClose }: ActivityConfigDialogProps) {
  const [config, setConfig] = useState<ActivityConfig>(INITIAL_ACTIVITY)
  const [step, setStep] = useState(0)

  // 切换到另一场活动时重置向导：回到第一步并带出该活动的配置
  useEffect(() => {
    if (!activity) return
    setConfig(createConfigFromList(activity))
    setStep(0)
  }, [activity])

  /** 局部更新活动配置 */
  const patch = (p: Partial<ActivityConfig>) => setConfig((c) => ({ ...c, ...p }))
  /** 更新奖池数组（增删改都走这里，保证单一数据源） */
  const updatePrizes = (prizes: ActivityPrize[]) => setConfig((c) => ({ ...c, prizes }))
  const changeStep = (next: number) => setStep(Math.max(0, Math.min(STEPS.length - 1, next)))

  /** 提交前必须满足的条件，按步骤聚合，用于步骤条红点与提交拦截 */
  const blockers = useMemo(() => {
    const basic = [
      !config.activityCode.trim(),
      !config.name.trim(),
      durationDays(config.startTime, config.endTime) <= 0,
      !config.shareTitle.trim(),
      !config.shareImageUrl,
    ].filter(Boolean).length

    const lottery = config.prizes.filter((p) => p.poolType === 1)
    const redeem = config.prizes.filter((p) => p.poolType === 2)
    const prize = [
      lottery.length === 0,
      totalWeight(lottery) !== WEIGHT_BASE,
      redeem.length === 0,
    ].filter(Boolean).length

    return [basic, prize]
  }, [config])

  const submit = () => {
    const total = blockers.reduce((s, n) => s + n, 0)
    if (total) {
      const first = blockers.findIndex((n) => n > 0)
      toast.error('还有必填项未完成', { description: `共 ${total} 项待处理，请先补齐` })
      changeStep(first)
      return
    }
    setConfig((c) => ({ ...c, status: 'REVIEW', version: c.version + 1 }))
    toast.success('已提交', { description: '运营主管审核通过后，到达开始时间自动生效' })
  }

  const status = STATUS_META[config.status]
  const days = durationDays(config.startTime, config.endTime)

  return (
    <Dialog open={!!activity} onOpenChange={(next) => !next && onClose()} disablePointerDismissal>
      <DialogContent
        showCloseButton={false}
        className="flex h-[92vh] w-[min(1180px,96vw)] max-w-none flex-col gap-0 overflow-hidden p-0 sm:max-w-none"
      >
        {/* 头部：活动标识 + 全局操作 */}
        <div className="shrink-0 border-b px-5 py-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <DialogTitle className="truncate text-[15px] font-semibold">{config.name || '未命名活动'}</DialogTitle>
                <Badge variant="secondary" className={cn('text-[11px] font-normal', status.className)}>
                  {status.label}
                </Badge>
                <span className="text-muted-foreground font-mono text-[11px]">{config.activityCode}</span>
                <span className="text-muted-foreground text-[11px]">v{config.version}</span>
                <DialogDescription className="sr-only">活动配置向导</DialogDescription>
              </div>
              <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11.5px]">
                <span className="flex items-center gap-1">
                  <Clock className="size-3.5" />
                  {config.startTime.replace('T', ' ')} — {config.endTime.replace('T', ' ')}
                </span>
                <span>·</span>
                <span>{days} 天</span>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Button size="sm" className="h-8 gap-1.5 text-[12.5px]" onClick={submit}>
                <Send className="size-3.5" />
                提交
              </Button>
              <Button variant="ghost" size="icon" className="size-8" onClick={onClose} aria-label="关闭">
                <X className="size-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* 步骤条 */}
        <div className="shrink-0 border-b px-4 py-2.5">
          <StepNav steps={STEPS} current={step} issueCounts={blockers} onChange={changeStep} />
        </div>

        {/* 步骤内容：独立滚动 */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {step === 0 && <BasicInfoStep value={config} onChange={patch} />}
          {step === 1 && <PrizePoolStep value={config} onPrizesChange={updatePrizes} />}
        </div>

        {/* 底部步骤导航 */}
        <div className="flex shrink-0 items-center justify-between border-t px-5 py-2.5">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1 text-[12.5px]"
            disabled={step === 0}
            onClick={() => changeStep(step - 1)}
          >
            <ChevronLeft className="size-4" />
            上一步
          </Button>
          <div className="text-muted-foreground text-[11px]">
            第 {step + 1} / {STEPS.length} 步
          </div>
          {step < STEPS.length - 1 ? (
            <Button variant="outline" size="sm" className="h-8 gap-1 text-[12.5px]" onClick={() => changeStep(step + 1)}>
              下一步
              <ChevronRight className="size-4" />
            </Button>
          ) : (
            <Button size="sm" className="h-8 gap-1.5 text-[12.5px]" onClick={submit}>
              <Send className="size-3.5" />
              提交
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
