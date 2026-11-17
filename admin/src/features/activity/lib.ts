import type { ActivityConfig, ActivityPrize, DeliveryMode, PrizeType, SimulationRow } from './types'

/** 权重基数：抽奖池权重合计固定为 10000，避免浮点误差 */
export const WEIGHT_BASE = 10000

/** 六类奖品的展示元信息 */
export const PRIZE_TYPE_META: Record<PrizeType, { label: string; className: string }> = {
  1: { label: '实物奖品', className: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' },
  2: { label: '虚拟奖品', className: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300' },
  3: { label: '积分', className: 'bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300' },
  4: { label: '谢谢参与', className: 'bg-muted text-muted-foreground' },
  5: { label: '红包', className: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' },
  6: { label: '优惠券', className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' },
  7: { label: '第三方奖品', className: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300' },
}

/** 下拉用的类型选项，顺序即产品口径 */
export const PRIZE_TYPE_OPTIONS: { value: PrizeType; label: string }[] = [
  { value: 1, label: '实物奖品' },
  { value: 2, label: '虚拟奖品' },
  { value: 6, label: '优惠券' },
  { value: 7, label: '第三方奖品' },
  { value: 3, label: '积分' },
  { value: 5, label: '红包' },
  { value: 4, label: '谢谢参与' },
]

/** 类型决定发放方式：实物走人工发货，虚拟走码库，第三方走直充，其余自动到账 */
export const defaultDeliveryFor = (type: PrizeType): DeliveryMode =>
  type === 1 ? 3 : type === 2 ? 2 : type === 7 ? 5 : 1

/** 发放方式文案 */
export const DELIVERY_META: Record<DeliveryMode, string> = {
  1: '自动到账',
  2: '码库发放',
  3: '人工发货',
  4: '线下核销',
  5: '三方直充',
}

/** 金额格式化：12 -> ¥12.00 */
export const formatMoney = (n: number) =>
  `¥${n.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

/** 抽奖池权重合计 */
export const totalWeight = (prizes: ActivityPrize[]) =>
  prizes.filter((p) => p.poolType === 1).reduce((sum, p) => sum + (p.weight || 0), 0)

/** 单个奖品的配置概率（按权重基数计算，合计非 10000 时总和会小于 100%，用于暴露问题） */
export const probabilityOf = (p: ActivityPrize) => (p.weight || 0) / WEIGHT_BASE

/** 单次抽奖的预期成本：Σ(概率 × 成本) */
export const expectedCostPerDraw = (prizes: ActivityPrize[]) =>
  prizes
    .filter((p) => p.poolType === 1)
    .reduce((sum, p) => sum + ((p.weight || 0) / WEIGHT_BASE) * p.costAmount, 0)

/** 某奖品按当前概率还能支撑多少次抽奖（限量奖品才有意义） */
const drawsUntilSoldOut = (p: ActivityPrize) => {
  if (p.totalStock === -1 || p.weight <= 0) return Number.POSITIVE_INFINITY
  return Math.floor((p.remainingStock * WEIGHT_BASE) / p.weight)
}

/** 当前配置整体可支撑的抽奖次数 = 所有限量奖品里最先售罄的那个 */
export const supportableDraws = (prizes: ActivityPrize[]) => {
  const list = prizes.filter((p) => p.poolType === 1).map(drawsUntilSoldOut)
  return list.length ? Math.min(...list) : Number.POSITIVE_INFINITY
}

/** 最先售罄的奖品 */
export const scarcestPrize = (prizes: ActivityPrize[]): ActivityPrize | null => {
  const limited = prizes
    .filter((p) => p.poolType === 1 && p.totalStock !== -1 && p.weight > 0)
    .map((p) => ({ p, draws: drawsUntilSoldOut(p) }))
    .sort((a, b) => a.draws - b.draws)
  return limited.length ? limited[0].p : null
}

/**
 * 一键均分权重：仅对 weight>0 的奖品均分，用最大余数法保证合计恰好 10000。
 * 若所有权重都是 0，则均分全部奖品。
 */
export const equalizeWeights = (prizes: ActivityPrize[]): ActivityPrize[] => {
  const pool = prizes.filter((p) => p.poolType === 1)
  const targets = pool.filter((p) => p.weight > 0).length ? pool.filter((p) => p.weight > 0) : pool
  if (!targets.length) return prizes

  const base = Math.floor(WEIGHT_BASE / targets.length)
  let remainder = WEIGHT_BASE - base * targets.length
  const next = new Map<string, number>()
  targets.forEach((p, i) => {
    // 余数按顺序补给前面的奖品，保证合计恒为 10000
    next.set(p.id, base + (i < remainder ? 1 : 0))
  })
  return prizes.map((p) => (next.has(p.id) ? { ...p, weight: next.get(p.id)! } : p))
}

/** 把「剩余权重」全部填充给指定奖品（吸收池） */
export const fillRemainingWeight = (prizes: ActivityPrize[], absorberId: string): ActivityPrize[] => {
  const others = prizes
    .filter((p) => p.poolType === 1 && p.id !== absorberId)
    .reduce((sum, p) => sum + (p.weight || 0), 0)
  const rest = Math.max(0, WEIGHT_BASE - others)
  return prizes.map((p) => (p.id === absorberId ? { ...p, weight: rest } : p))
}

/** 生成一个本地唯一 id（mock 用；真实项目由后端返回） */
export const uid = () => `p_${Math.random().toString(36).slice(2, 8)}`

/**
 * 模拟抽奖：按当前权重随机 10 万次，用于上线前验证概率引擎与分布。
 * 这里只做纯计算，不写库、不扣库存，和真实引擎的纯计算分支保持一致。
 */
export const simulate = (prizes: ActivityPrize[], times = 100_000): SimulationRow[] => {
  const pool = prizes.filter(
    (p) => p.poolType === 1 && p.weight > 0 && (p.totalStock === -1 || p.remainingStock > 0),
  )
  const total = pool.reduce((sum, p) => sum + p.weight, 0)
  const counts = new Map<string, number>()
  pool.forEach((p) => counts.set(p.id, 0))

  if (!total) return []

  for (let i = 0; i < times; i++) {
    let rand = Math.random() * total
    for (const p of pool) {
      rand -= p.weight
      if (rand < 0) {
        counts.set(p.id, (counts.get(p.id) ?? 0) + 1)
        break
      }
    }
  }

  return pool.map((p) => {
    const count = counts.get(p.id) ?? 0
    const configured = p.weight / WEIGHT_BASE
    const actual = count / times
    return {
      prizeId: p.id,
      name: p.name,
      configured,
      actual,
      deviation: actual - configured,
      count,
    }
  })
}

/** 百分比展示：0.005 -> 0.50% */
export const formatPercent = (v: number, digits = 2) => `${(v * 100).toFixed(digits)}%`

/** 时间窗天数（含首尾） */
export const durationDays = (start: string, end: string) => {
  const s = new Date(start).getTime()
  const e = new Date(end).getTime()
  if (Number.isNaN(s) || Number.isNaN(e) || e <= s) return 0
  return Math.ceil((e - s) / (24 * 3600 * 1000))
}

/** 估算单个用户在活动期内最多可获得的积分：期初赠送 + 启用任务 × 天数 */
export const estimateMaxPoints = (config: ActivityConfig) => {
  const days = durationDays(config.startTime, config.endTime) || 7
  const perDay = config.tasks
    .filter((t) => t.enabled)
    .reduce((sum, t) => sum + t.pointsReward * Math.max(1, t.dailyLimit), 0)
  return config.initialPoints + perDay * days
}
