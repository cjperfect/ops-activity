/** 活动配置相关的领域模型定义（与后端表结构一一对应，便于后续直接换成接口数据） */

/** 奖品类型：实物 / 虚拟 / 积分 / 谢谢参与 / 红包 / 优惠券 / 第三方 */
export type PrizeType = 1 | 2 | 3 | 4 | 5 | 6 | 7
/** 奖池类型：1 抽奖池 / 2 兑换池 */
export type PoolType = 1 | 2
/** 发放方式：1 自动到账 / 2 码库发放 / 3 人工发货 / 4 线下核销 / 5 三方直充 */
export type DeliveryMode = 1 | 2 | 3 | 4 | 5
/** 活动类型：1 仅抽奖 / 2 仅兑换 / 3 抽奖+兑换 */
export type ActivityType = 1 | 2 | 3
/** 抽奖消耗：1 免费 / 2 消耗积分 / 3 消耗次数券 */
export type DrawCostType = 1 | 2 | 3
/** 活动状态 */
export type ActivityStatus = 'DRAFT' | 'REVIEW' | 'ONLINE'

/** 奖品模板（奖品本体，跨活动复用） */
export interface PrizeTemplate {
  templateCode: string
  name: string
  prizeType: PrizeType
  deliveryMode: DeliveryMode
  /** 面值，用于展示与成本估算 */
  faceValue: number
  /** 实际采购成本 */
  costAmount: number
  emoji: string
  /** 类型专属的简短说明，如规格、码来源 */
  extra?: string
}

/** 活动奖品配置（挂在某活动某个奖池上的运营参数） */
export interface ActivityPrize {
  id: string
  templateCode: string
  name: string
  prizeType: PrizeType
  deliveryMode: DeliveryMode
  poolType: PoolType
  emoji: string
  /** 抽奖权重，整数，同池合计应为 10000 */
  weight: number
  /** 兑换所需积分 */
  pointsPrice: number
  /** 总库存，-1 表示不限量 */
  totalStock: number
  /** 剩余库存 */
  remainingStock: number
  /** 每日发放上限，0 不限 */
  dailyStockLimit: number
  /** 每人限中/限兑，0 不限 */
  userLimit: number
  /** 是否保底奖品（每池最多一个） */
  guarantee: boolean
  /** 是否在前端奖池中展示 */
  isShow: boolean
  /** 转盘格子上展示的文案 */
  displayText?: string
  sortNo: number
  faceValue: number
  costAmount: number
}

/** 赚积分任务 */
export interface TaskConfig {
  code: string
  name: string
  /** 奖励积分 */
  pointsReward: number
  /** 每日可完成次数 */
  dailyLimit: number
  enabled: boolean
  description: string
}

/** 活动配置整体 */
export interface ActivityConfig {
  activityCode: string
  name: string
  subTitle: string
  activityType: ActivityType
  channel: string
  startTime: string
  endTime: string

  drawCostType: DrawCostType
  drawCostValue: number
  dailyDrawLimit: number
  totalDrawLimit: number
  dailyRedeemLimit: number
  totalRedeemLimit: number

  needLogin: boolean
  needPhone: boolean
  memberLevel: number

  /** 分享卡片图片地址（5:2） */
  shareImageUrl: string
  description: string
  internalRemark: string

  initialPoints: number
  maxEarnPerUser: number
  expirePolicy: 'AFTER_7_DAYS' | 'NEVER' | 'ON_END'
  tasks: TaskConfig[]

  pageTemplate: 'WHEEL' | 'GRID' | 'LIST'
  primaryColor: string
  ruleText: string
  shareTitle: string

  status: ActivityStatus
  /** 版本号，用于变更留痕 */
  version: number
  prizes: ActivityPrize[]
}

/** 体检项 */
export interface PreflightIssue {
  id: string
  level: 'block' | 'warn'
  title: string
  detail: string
  /** 建议跳转的步骤索引（0-4），点「去处理」时跳转 */
  step: number
}

/** 模拟抽奖的分布结果 */
export interface SimulationRow {
  prizeId: string
  name: string
  configured: number
  actual: number
  deviation: number
  count: number
}

/** 活动列表行：列表页与配置弹窗共用的轻量视图模型 */
export interface ActivityListItem {
  code: string
  name: string
  /** 1=仅抽奖 2=仅积分兑换 3=抽奖+兑换 */
  activityType: 1 | 2 | 3
  status: ActivityStatus
  startTime: string
  endTime: string
  uv: number
  draws: number
  owner: string
}
