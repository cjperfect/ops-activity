import { AlertTriangle, MoreHorizontal, Plus, Scale, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

import {
  DELIVERY_META,
  PRIZE_TYPE_META,
  PRIZE_TYPE_OPTIONS,
  WEIGHT_BASE,
  defaultDeliveryFor,
  equalizeWeights,
  fillRemainingWeight,
  formatMoney,
  formatPercent,
  totalWeight,
} from '../lib'
import { PRIZE_TEMPLATES } from '../mock-data'
import type { ActivityConfig, ActivityPrize, PoolType } from '../types'
import { PrizeTypeBadge } from '../components/prize-type-badge'

interface PrizePoolStepProps {
  value: ActivityConfig
  onPrizesChange: (prizes: ActivityPrize[]) => void
}

export function PrizePoolStep({ value, onPrizesChange }: PrizePoolStepProps) {
  const [tab, setTab] = useState<'lottery' | 'redeem'>('lottery')
  const [addOpen, setAddOpen] = useState(false)

  const lottery = value.prizes.filter((p) => p.poolType === 1)
  const redeem = value.prizes.filter((p) => p.poolType === 2)
  const weightSum = totalWeight(lottery)

  /** 更新单个奖品字段 */
  const patchPrize = (id: string, patch: Partial<ActivityPrize>) => {
    onPrizesChange(value.prizes.map((p) => (p.id === id ? { ...p, ...patch } : p)))
  }

  const removePrize = (id: string) => {
    const target = value.prizes.find((p) => p.id === id)
    onPrizesChange(value.prizes.filter((p) => p.id !== id))
    toast.success('已移除奖品', { description: target?.name })
  }

  /** 添加奖品：从模板库写入当前奖池，带默认权重/库存 */
  const addPrize = (templateCode: string) => {
    const tpl = PRIZE_TEMPLATES.find((t) => t.templateCode === templateCode)
    if (!tpl) return
    const pool: PoolType = tab === 'lottery' ? 1 : 2
    const next: ActivityPrize = {
      id: `p_${Date.now()}`,
      templateCode: tpl.templateCode,
      name: tpl.name,
      prizeType: tpl.prizeType,
      deliveryMode: tpl.deliveryMode,
      poolType: pool,
      emoji: tpl.emoji,
      // 抽奖池默认给 100 权重；兑换池按面值给一个参考积分价
      weight: pool === 1 ? 100 : 0,
      pointsPrice: pool === 2 ? Math.max(15, Math.round(tpl.faceValue || 15)) : 0,
      totalStock: tpl.prizeType === 1 ? 10 : -1,
      remainingStock: tpl.prizeType === 1 ? 10 : -1,
      dailyStockLimit: 0,
      userLimit: 0,
      guarantee: false,
      isShow: true,
      sortNo: value.prizes.filter((p) => p.poolType === pool).length + 1,
      faceValue: tpl.faceValue,
      costAmount: tpl.costAmount,
    }
    onPrizesChange([...value.prizes, next])
    setAddOpen(false)
    toast.success(`已添加「${tpl.name}」`, { description: '记得确认概率与库存' })
  }

  return (
    <div className="space-y-3">
      <Tabs value={tab} onValueChange={(v) => setTab(v as 'lottery' | 'redeem')}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TabsList className="h-8">
            <TabsTrigger value="lottery" className="h-6 text-[13px]">
              抽奖奖品
              <Badge variant="secondary" className="ml-1.5 h-4 px-1 text-[10px]">
                {lottery.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="redeem" className="h-6 text-[13px]">
              兑换奖品
              <Badge variant="secondary" className="ml-1.5 h-4 px-1 text-[10px]">
                {redeem.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            {tab === 'lottery' && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-[12.5px]"
                onClick={() => {
                  onPrizesChange(equalizeWeights(value.prizes))
                  toast.success('已均分概率', { description: '合计固定为 100%' })
                }}
              >
                <Scale className="size-3.5" />
                一键均分
              </Button>
            )}
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger
                render={
                  <Button size="sm" className="h-8 gap-1.5 text-[12.5px]">
                    <Plus className="size-3.5" />
                    添加奖品
                  </Button>
                }
              />
              {renderAddDialog(value.prizes, tab === 'lottery' ? 1 : 2, addPrize)}
            </Dialog>
          </div>
        </div>

        {/* ---------------- 抽奖奖品 ---------------- */}
        <TabsContent value="lottery" className="mt-3 space-y-3">
          {weightSum !== WEIGHT_BASE && (
            <Alert variant="destructive" className="py-2.5">
              <AlertTriangle className="size-4" />
              <AlertTitle className="text-sm">抽奖概率合计必须为 100%</AlertTitle>
              <AlertDescription className="text-xs">
                当前合计 {formatPercent(weightSum / WEIGHT_BASE)}，{weightSum > WEIGHT_BASE ? `超出 ${formatPercent((weightSum - WEIGHT_BASE) / WEIGHT_BASE)}` : `还差 ${formatPercent((WEIGHT_BASE - weightSum) / WEIGHT_BASE)}`}
                。可用「一键均分」或行内「填充剩余权重」修正。
              </AlertDescription>
            </Alert>
          )}

          <PrizeTable
            pool={1}
            prizes={lottery}
            onPatch={patchPrize}
            onRemove={removePrize}
            onFillRest={(id) => {
              onPrizesChange(fillRemainingWeight(value.prizes, id))
              toast.success('已把剩余权重填入该奖品')
            }}
          />
        </TabsContent>

        {/* ---------------- 兑换奖品 ---------------- */}
        <TabsContent value="redeem" className="mt-3 space-y-3">
          <PrizeTable pool={2} prizes={redeem} onPatch={patchPrize} onRemove={removePrize} onFillRest={() => {}} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

/** 奖品表格：抽奖与兑换共用，按 pool 决定中间列 */
function PrizeTable({
  pool,
  prizes,
  onPatch,
  onRemove,
  onFillRest,
}: {
  pool: PoolType
  prizes: ActivityPrize[]
  onPatch: (id: string, patch: Partial<ActivityPrize>) => void
  onRemove: (id: string) => void
  onFillRest: (id: string) => void
}) {
  return (
    <Card className="overflow-hidden py-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-[13px]">
          <thead>
            <tr className="bg-muted/50 text-muted-foreground border-b text-left text-[11px]">
              <th className="px-3 py-2 font-medium">奖品</th>
              {pool === 1 ? (
                <th className="w-[26%] px-3 py-2 font-medium">概率（%）</th>
              ) : (
                <th className="w-[20%] px-3 py-2 font-medium">兑换积分价</th>
              )}
              <th className="w-[24%] px-3 py-2 font-medium">库存</th>
              <th className="w-[8%] px-3 py-2 text-right font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {prizes.map((p) => (
              <tr key={p.id} className="hover:bg-accent/30 border-b transition-colors last:border-0">
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="bg-muted flex size-9 shrink-0 items-center justify-center rounded-md text-lg">{p.emoji}</div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="truncate font-medium">{p.name}</span>
                        {/* 奖品类型可直接下拉改，改完自动带出对应发放方式 */}
                        <Select
                          value={PRIZE_TYPE_META[p.prizeType].label}
                          onValueChange={(v) => {
                            const opt = PRIZE_TYPE_OPTIONS.find((o) => o.label === v)
                            if (!opt) return
                            onPatch(p.id, { prizeType: opt.value, deliveryMode: defaultDeliveryFor(opt.value) })
                          }}
                        >
                          <SelectTrigger
                            size="sm"
                            className="h-6 w-[88px] gap-1 rounded border-none bg-transparent px-1.5 text-[11px] text-muted-foreground hover:bg-accent"
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {PRIZE_TYPE_OPTIONS.map((o) => (
                              <SelectItem key={o.value} value={o.label} className="text-[12px]">
                                {o.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
                        <span>{DELIVERY_META[p.deliveryMode]}</span>
                        <span>·</span>
                        <span>{p.faceValue ? `面值 ${formatMoney(p.faceValue)}` : '无面值'}</span>
                        {pool === 1 && p.weight === 0 && <span className="text-amber-600">· 概率 0%，不参与抽奖</span>}
                      </div>
                    </div>
                  </div>
                </td>

                {pool === 1 ? (
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1">
                      {/* 运营直接填百分比，2 位小数；底层换算成整数权重（1% = 100 权重） */}
                      <Input
                        type="number"
                        step="0.01"
                        min={0}
                        max={100}
                        className="h-7 w-[72px] px-2 text-[13px] tabular-nums"
                        value={Number((p.weight / 100).toFixed(2))}
                        onChange={(e) =>
                          onPatch(p.id, {
                            weight: Math.max(0, Math.min(WEIGHT_BASE, Math.round((Number(e.target.value) || 0) * 100))),
                          })
                        }
                      />
                      <span className="text-muted-foreground text-[11px]">%</span>
                    </div>
                  </td>
                ) : (
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        className="h-7 w-16 px-2 text-[13px] tabular-nums"
                        value={p.pointsPrice}
                        onChange={(e) => onPatch(p.id, { pointsPrice: Math.max(0, Number(e.target.value) || 0) })}
                      />
                      <span className="text-muted-foreground text-[11px]">分</span>
                    </div>
                  </td>
                )}

                <td className="px-3 py-2.5">
                  <StockCell prize={p} onPatch={onPatch} />
                </td>

                <td className="px-3 py-2.5 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button variant="ghost" size="icon" className="size-7">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="end" className="w-44">
                      {pool === 1 && (
                        <DropdownMenuItem onClick={() => onFillRest(p.id)} className="text-[13px]">
                          填充剩余权重
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() =>
                          onPatch(p.id, {
                            totalStock: p.totalStock === -1 ? 10 : -1,
                            remainingStock: p.totalStock === -1 ? 10 : -1,
                          })
                        }
                        className="text-[13px]"
                      >
                        {p.totalStock === -1 ? '设为限量' : '设为不限量'}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onRemove(p.id)} className="text-destructive text-[13px]">
                        <Trash2 className="mr-1.5 size-3.5" />
                        移除奖品
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}

            {!prizes.length && (
              <tr>
                <td colSpan={4} className="text-muted-foreground px-3 py-10 text-center text-xs">
                  还没有奖品，点击右上角「添加奖品」从模板库选择
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {prizes.length > 0 && (
        <div className="bg-muted/40 flex items-center justify-between border-t px-3 py-2 text-[12px]">
          <span className="text-muted-foreground">
            共 {prizes.length} 个奖品，限量 {prizes.filter((p) => p.totalStock !== -1).length} 个
          </span>
          {pool === 1 ? (
            <span className="tabular-nums">
              概率合计 <strong className={cn(totalWeight(prizes) === WEIGHT_BASE ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive')}>
                {formatPercent(totalWeight(prizes) / WEIGHT_BASE)}
              </strong>
            </span>
          ) : (
            <span className="tabular-nums">
              最低积分价 <strong>{prizes.length ? Math.min(...prizes.map((p) => p.pointsPrice)) : 0}</strong> 分
            </span>
          )}
        </div>
      )}
    </Card>
  )
}

/** 库存单元格：限量时可直接编辑总量，不限量时显示徽标 */
function StockCell({
  prize,
  onPatch,
}: {
  prize: ActivityPrize
  onPatch: (id: string, patch: Partial<ActivityPrize>) => void
}) {
  if (prize.totalStock === -1) {
    return (
      <div className="flex items-center gap-1.5">
        <Badge variant="secondary" className="text-[11px] font-normal">
          不限量
        </Badge>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-1">
      <Input
        type="number"
        className="h-7 w-16 px-2 text-[13px] tabular-nums"
        value={prize.totalStock}
        onChange={(e) => {
          const total = Math.max(0, Number(e.target.value) || 0)
          onPatch(prize.id, { totalStock: total, remainingStock: Math.min(prize.remainingStock, total) })
        }}
      />
      <span className="text-muted-foreground text-[11px] tabular-nums">剩 {prize.remainingStock}</span>
    </div>
  )
}

/** 添加奖品弹窗：只允许选模板，不允许临时手填，避免类型与发放方式配错 */
function renderAddDialog(existing: ActivityPrize[], pool: PoolType, onAdd: (code: string) => void) {
  return (
    <DialogContent className="max-h-[80vh] gap-0 sm:max-w-lg">
      <DialogHeader className="pb-3">
        <DialogTitle className="text-sm">{pool === 1 ? '添加到抽奖奖品' : '添加到兑换奖品'}</DialogTitle>
        <DialogDescription className="text-xs">
          奖品来自模板库，类型与发放方式已锁定；添加后再设权重与库存
        </DialogDescription>
      </DialogHeader>
      <ScrollArea className="h-[420px] pr-3">
        <div className="space-y-1.5">
          {PRIZE_TEMPLATES.map((t) => {
            const used = existing.some((p) => p.templateCode === t.templateCode && p.poolType === pool)
            return (
              <div
                key={t.templateCode}
                className={cn(
                  'flex items-center gap-3 rounded-lg border p-2.5',
                  used ? 'opacity-50' : 'hover:border-primary/40 hover:bg-accent/30',
                )}
              >
                <div className="bg-muted flex size-9 items-center justify-center rounded-md text-lg">{t.emoji}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-[13px] font-medium">{t.name}</span>
                    <PrizeTypeBadge type={t.prizeType} />
                  </div>
                  <div className="text-muted-foreground mt-0.5 truncate text-[11px]">
                    {DELIVERY_META[t.deliveryMode]} · {t.extra} · 成本 {formatMoney(t.costAmount)}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={used ? 'secondary' : 'outline'}
                  disabled={used}
                  className="h-7 shrink-0 text-[12px]"
                  onClick={() => onAdd(t.templateCode)}
                >
                  {used ? '已添加' : '添加'}
                </Button>
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </DialogContent>
  )
}
