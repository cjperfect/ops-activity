import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

import { PRIZE_TYPE_META } from '../lib'
import type { PrizeType } from '../types'

/** 奖品类型徽标：颜色语义固定，六类一眼可辨 */
export function PrizeTypeBadge({ type, className }: { type: PrizeType; className?: string }) {
  const meta = PRIZE_TYPE_META[type]
  return (
    <Badge variant="secondary" className={cn('h-5 rounded px-1.5 text-[11px] font-normal', meta.className, className)}>
      {meta.label}
    </Badge>
  )
}
