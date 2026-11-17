import type { ActivityConfig, ActivityListItem, PrizeTemplate } from './types'

/** 奖品模板库（mock）：真实项目里来自 /admin/prize-templates */
export const PRIZE_TEMPLATES: PrizeTemplate[] = [
  { templateCode: 'JD_CARD_50', name: '50元京东卡', prizeType: 2, deliveryMode: 2, faceValue: 50, costAmount: 46.5, emoji: '🎁', extra: '自建码库 · 16位' },
  { templateCode: 'BAG_CANVAS', name: '定制帆布袋', prizeType: 1, deliveryMode: 3, faceValue: 39, costAmount: 12, emoji: '👜', extra: '均码 · 深圳仓' },
  { templateCode: 'RED_5', name: '5元红包', prizeType: 5, deliveryMode: 1, faceValue: 5, costAmount: 5, emoji: '💰', extra: '微信红包' },
  { templateCode: 'POINT_20', name: '20积分', prizeType: 3, deliveryMode: 1, faceValue: 0, costAmount: 0, emoji: '⭐', extra: '发放 20 积分' },
  { templateCode: 'COUPON_100_20', name: '满100减20券', prizeType: 6, deliveryMode: 1, faceValue: 20, costAmount: 8, emoji: '🎫', extra: '满减 · 全店通用' },
  { templateCode: 'THANKS', name: '谢谢参与', prizeType: 4, deliveryMode: 1, faceValue: 0, costAmount: 0, emoji: '😶', extra: '差一点点，再来一次' },
  { templateCode: 'JD_CARD_100', name: '100元京东卡', prizeType: 2, deliveryMode: 2, faceValue: 100, costAmount: 94, emoji: '🎁', extra: '自建码库 · 16位' },
  { templateCode: 'CUP_THERMOS', name: '保温杯', prizeType: 1, deliveryMode: 4, faceValue: 89, costAmount: 35, emoji: '🥤', extra: '到店核销' },
  { templateCode: 'COUPON_200_50', name: '满200减50券', prizeType: 6, deliveryMode: 1, faceValue: 50, costAmount: 20, emoji: '🎟️', extra: '满减 · 全店通用' },
]

/** 活动列表 mock：列表页与配置弹窗共用同一份数据源 */
export const MOCK_ACTIVITY_LIST: ActivityListItem[] = [
  {
    code: 'BREO_202611_MEMBER',
    name: '11月会员日 · 积分抽好礼',
    activityType: 3,
    status: 'DRAFT',
    startTime: '2026-11-20T00:00',
    endTime: '2026-11-27T23:59',
    uv: 0,
    draws: 0,
    owner: '陈江',
  },
  {
    code: 'BREO_202612_NEWYEAR',
    name: '元旦跨年 · 天天抽好礼',
    activityType: 1,
    status: 'REVIEW',
    startTime: '2026-12-28T00:00',
    endTime: '2027-01-03T23:59',
    uv: 12840,
    draws: 38120,
    owner: '李雯',
  },
  {
    code: 'BREO_202610_NATIONAL',
    name: '国庆积分兑换专场',
    activityType: 2,
    status: 'ONLINE',
    startTime: '2026-10-01T00:00',
    endTime: '2026-10-07T23:59',
    uv: 40219,
    draws: 0,
    owner: '陈江',
  },
]

/** 按列表行生成配置初值：切换活动时能带出对应名称/类型/时间/奖池 */
export function createConfigFromList(item: ActivityListItem): ActivityConfig {
  const prizes =
    item.activityType === 3
      ? INITIAL_ACTIVITY.prizes
      : INITIAL_ACTIVITY.prizes.filter((p) => (item.activityType === 1 ? p.poolType === 1 : p.poolType === 2))

  return {
    ...INITIAL_ACTIVITY,
    activityCode: item.code,
    name: item.name,
    activityType: item.activityType,
    status: item.status,
    startTime: item.startTime,
    endTime: item.endTime,
    prizes,
  }
}

/** 初始活动配置：用来演示「已配置到一半」的真实状态 */
export const INITIAL_ACTIVITY: ActivityConfig = {
  activityCode: 'BREO_202611_MEMBER',
  name: '11月会员日 · 积分抽好礼',
  subTitle: '签到攒积分，抽50元京东卡',
  activityType: 3,
  channel: '倍轻松小程序',
  startTime: '2026-11-20T00:00',
  endTime: '2026-11-27T23:59',

  drawCostType: 2,
  drawCostValue: 10,
  dailyDrawLimit: 3,
  totalDrawLimit: 20,
  dailyRedeemLimit: 1,
  totalRedeemLimit: 3,

  needLogin: true,
  needPhone: false,
  memberLevel: 0,

  shareImageUrl: '',
  description: '会员日专属抽奖，100% 有奖，先到先得。',
  internalRemark: '双十一返场活动，预算 5000 元，由运营二组负责。',

  initialPoints: 5,
  maxEarnPerUser: 120,
  expirePolicy: 'AFTER_7_DAYS',
  tasks: [
    { code: 'SIGN_IN', name: '每日签到', pointsReward: 5, dailyLimit: 1, enabled: true, description: '每天签到 +5 积分，最稳的积分来源' },
    { code: 'BROWSE', name: '浏览活动页', pointsReward: 2, dailyLimit: 1, enabled: true, description: '停留 ≥15 秒，服务端校验时长' },
    { code: 'SHARE', name: '分享给好友', pointsReward: 3, dailyLimit: 1, enabled: false, description: '分享到会话或朋友圈' },
    { code: 'INVITE', name: '邀请新用户', pointsReward: 20, dailyLimit: 3, enabled: false, description: '高风险，需风控配合，P1 再做' },
    { code: 'ORDER', name: '下单', pointsReward: 10, dailyLimit: 0, enabled: false, description: '与交易系统对接，按金额 1:1' },
  ],

  pageTemplate: 'GRID',
  primaryColor: '#0F766E',
  ruleText:
    '【活动时间】2026年11月20日 00:00 — 11月27日 23:59\n' +
    '【参与方式】活动期间登录小程序，签到或完成任务获得积分，10 积分可抽奖 1 次。\n' +
    '【奖品说明】奖品数量有限，先到先得；实物奖品需在 7 天内填写收货地址，逾期视为放弃。\n' +
    '【积分说明】活动积分仅限本活动使用，活动结束后 7 天自动清零。',
  shareTitle: '签到就抽50元京东卡',

  status: 'DRAFT',
  version: 3,
  prizes: [
    // ---------------- 抽奖池：权重合计 10000 ----------------
    {
      id: 'p1', templateCode: 'JD_CARD_50', name: '50元京东卡', prizeType: 2, deliveryMode: 2, poolType: 1,
      emoji: '🎁', weight: 50, pointsPrice: 0, totalStock: 10, remainingStock: 8,
      dailyStockLimit: 0, userLimit: 1, guarantee: false, isShow: true, displayText: '50元卡',
      sortNo: 1, faceValue: 50, costAmount: 46.5,
    },
    {
      id: 'p2', templateCode: 'BAG_CANVAS', name: '定制帆布袋', prizeType: 1, deliveryMode: 3, poolType: 1,
      emoji: '👜', weight: 150, pointsPrice: 0, totalStock: 20, remainingStock: 3,
      dailyStockLimit: 0, userLimit: 1, guarantee: false, isShow: true, displayText: '帆布袋',
      sortNo: 2, faceValue: 39, costAmount: 12,
    },
    {
      id: 'p3', templateCode: 'RED_5', name: '5元红包', prizeType: 5, deliveryMode: 1, poolType: 1,
      emoji: '💰', weight: 300, pointsPrice: 0, totalStock: -1, remainingStock: -1,
      dailyStockLimit: 0, userLimit: 1, guarantee: false, isShow: true, displayText: '5元红包',
      sortNo: 3, faceValue: 5, costAmount: 5,
    },
    {
      id: 'p4', templateCode: 'POINT_20', name: '20积分', prizeType: 3, deliveryMode: 1, poolType: 1,
      emoji: '⭐', weight: 2500, pointsPrice: 0, totalStock: -1, remainingStock: -1,
      dailyStockLimit: 0, userLimit: 3, guarantee: false, isShow: true, displayText: '20积分',
      sortNo: 4, faceValue: 0, costAmount: 0,
    },
    {
      id: 'p5', templateCode: 'COUPON_100_20', name: '满100减20券', prizeType: 6, deliveryMode: 1, poolType: 1,
      emoji: '🎫', weight: 5000, pointsPrice: 0, totalStock: -1, remainingStock: -1,
      dailyStockLimit: 0, userLimit: 1, guarantee: false, isShow: true, displayText: '满减券',
      sortNo: 5, faceValue: 20, costAmount: 8,
    },
    {
      id: 'p6', templateCode: 'THANKS', name: '谢谢参与', prizeType: 4, deliveryMode: 1, poolType: 1,
      emoji: '😶', weight: 2000, pointsPrice: 0, totalStock: -1, remainingStock: -1,
      dailyStockLimit: 0, userLimit: 0, guarantee: false, isShow: true, displayText: '谢谢参与',
      sortNo: 6, faceValue: 0, costAmount: 0,
    },
    // ---------------- 兑换池 ----------------
    {
      id: 'r1', templateCode: 'BAG_CANVAS', name: '定制帆布袋', prizeType: 1, deliveryMode: 3, poolType: 2,
      emoji: '👜', weight: 0, pointsPrice: 80, totalStock: 12, remainingStock: 12,
      dailyStockLimit: 3, userLimit: 1, guarantee: false, isShow: true,
      sortNo: 1, faceValue: 39, costAmount: 12,
    },
    {
      id: 'r2', templateCode: 'COUPON_100_20', name: '满100减20券', prizeType: 6, deliveryMode: 1, poolType: 2,
      emoji: '🎫', weight: 0, pointsPrice: 30, totalStock: -1, remainingStock: -1,
      dailyStockLimit: 0, userLimit: 2, guarantee: false, isShow: true,
      sortNo: 2, faceValue: 20, costAmount: 8,
    },
    {
      id: 'r3', templateCode: 'POINT_20', name: '20积分', prizeType: 3, deliveryMode: 1, poolType: 2,
      emoji: '⭐', weight: 0, pointsPrice: 15, totalStock: -1, remainingStock: -1,
      dailyStockLimit: 0, userLimit: 0, guarantee: false, isShow: true,
      sortNo: 3, faceValue: 0, costAmount: 0,
    },
  ],
}
