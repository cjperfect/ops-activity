import { Check, ChevronRight } from 'lucide-react'

import { cn } from '@/lib/utils'

export interface StepItem {
  label: string
  desc: string
}

interface StepNavProps {
  steps: StepItem[]
  current: number
  /** 每步的问题数量：>0 显示红点，用于提示「这一步还有配置没做完」 */
  issueCounts?: number[]
  onChange: (index: number) => void
}

/** 横向步骤条：已完成的步骤显示对勾，有问题的步骤显示红点 */
export function StepNav({ steps, current, issueCounts = [], onChange }: StepNavProps) {
  return (
    <div className="border-border bg-card overflow-x-auto rounded-xl border">
      <div className="flex items-stretch">
        {steps.map((step, i) => {
          const done = i < current
          const active = i === current
          const issues = issueCounts[i] ?? 0
          return (
            <button
              key={step.label}
              type="button"
              onClick={() => onChange(i)}
              className={cn(
                'group relative flex min-w-0 flex-1 items-center gap-2 px-2.5 py-2.5 text-left transition-colors lg:gap-2.5 lg:px-4 lg:py-3',
                active ? 'bg-accent/60' : 'hover:bg-accent/30',
              )}
            >
              {/* 序号 / 对勾 */}
              <span
                className={cn(
                  'flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold transition-colors',
                  active && 'bg-primary text-primary-foreground',
                  done && !active && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
                  !done && !active && 'bg-muted text-muted-foreground',
                )}
              >
                {done ? <Check className="size-3.5" /> : i + 1}
              </span>

              <span className="min-w-0">
                <span className={cn('block truncate text-[13px]', active ? 'font-semibold' : 'font-medium')}>
                  {step.label}
                </span>
                {/* 窄屏只留标题，五步才能一屏排下 */}
                <span className="text-muted-foreground hidden truncate text-[11px] lg:block">{step.desc}</span>
              </span>

              {/* 该步骤存在问题时的提醒点 */}
              {issues > 0 && (
                <span className="bg-destructive/10 text-destructive ml-auto rounded px-1.5 py-0.5 text-[10px] font-medium">
                  {issues}
                </span>
              )}

              {i < steps.length - 1 && (
                <ChevronRight className="text-border absolute top-1/2 right-0 size-4 -translate-y-1/2" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
