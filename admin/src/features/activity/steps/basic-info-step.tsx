import { CalendarRange, ImagePlus, Lock, Share2, Trash2, Wand2 } from 'lucide-react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

import { durationDays } from '../lib'
import type { ActivityConfig } from '../types'
import { Field } from '../components/field'

interface BasicInfoStepProps {
  value: ActivityConfig
  onChange: (patch: Partial<ActivityConfig>) => void
}

/** 示例分享图：离线可用的 SVG data URI，避免依赖外部图片服务 */
const DEMO_SHARE_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="200">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0F766E"/><stop offset="100%" stop-color="#115E59"/>
      </linearGradient></defs>
      <rect width="500" height="200" fill="url(#g)"/>
      <text x="32" y="92" font-family="PingFang SC, sans-serif" font-size="30" fill="#ffffff">会员日 · 积分抽好礼</text>
      <text x="32" y="136" font-family="PingFang SC, sans-serif" font-size="16" fill="#99F6E4">签到攒积分，抽 50 元京东卡</text>
    </svg>`,
  )

export function BasicInfoStep({ value, onChange }: BasicInfoStepProps) {
  /** 按规则自动生成编码：业务线_年月_主题，运营只需填主题缩写 */
  const generateCode = () => {
    const ym = new Date().toISOString().slice(0, 7).replace('-', '')
    const suffix = Math.random().toString(36).slice(2, 6).toUpperCase()
    onChange({ activityCode: `ACT_${ym}_${suffix}` })
    toast.success('已生成活动编码', { description: '可手动修改，创建后不可变更' })
  }

  const days = durationDays(value.startTime, value.endTime)

  return (
    <div className="space-y-4">
      {/* ---------------- 活动信息 ---------------- */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">活动信息</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Field
            label="活动编码"
            required
            hint={<span className="text-emerald-600 dark:text-emerald-500">编码可用 · 创建后不可修改，用于小程序入口与埋点</span>}
          >
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  value={value.activityCode}
                  onChange={(e) => onChange({ activityCode: e.target.value.toUpperCase() })}
                  placeholder="BREO_202611_MEMBER"
                  className="font-mono text-[13px] uppercase"
                />
                <Lock className="text-muted-foreground absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2" />
              </div>
              <Button variant="outline" size="sm" className="shrink-0 gap-1.5" onClick={generateCode}>
                <Wand2 className="size-3.5" />
                生成
              </Button>
            </div>
          </Field>

          <Field label="活动名称" required hint="小程序活动卡片仅展示 12 字，超出部分省略">
            <Input
              value={value.name}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="如：11月会员日 · 积分抽好礼"
              maxLength={100}
            />
          </Field>
        </CardContent>
      </Card>

      {/* ---------------- 活动时间 ---------------- */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-1.5 text-sm">
            <CalendarRange className="text-muted-foreground size-4" />
            活动时间
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="开始时间" required>
              <Input type="datetime-local" value={value.startTime} onChange={(e) => onChange({ startTime: e.target.value })} />
            </Field>
            <Field
              label="结束时间"
              required
              hint={days > 0 ? `活动共 ${days} 天，按北京时间计算` : '结束时间必须晚于开始时间'}
            >
              <Input type="datetime-local" value={value.endTime} onChange={(e) => onChange({ endTime: e.target.value })} />
            </Field>
          </div>
          {days === 0 && (
            <div className="text-destructive bg-destructive/5 mt-3 rounded-md px-3 py-2 text-xs">结束时间必须晚于开始时间</div>
          )}
        </CardContent>
      </Card>

      {/* ---------------- 分享配置 ---------------- */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-1.5 text-sm">
            <Share2 className="text-muted-foreground size-4" />
            分享配置
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-[300px_1fr]">
          <Field label="分享图片" required hint="分享卡片 5:2，建议 500×200，≤2MB，JPG/PNG">
            <div className="space-y-2">
              <div
                className={cn(
                  'bg-muted/30 relative flex aspect-[5/2] w-full items-center justify-center overflow-hidden rounded-lg border border-dashed',
                  value.shareImageUrl ? 'border-solid' : '',
                )}
              >
                {value.shareImageUrl ? (
                  <>
                    <img src={value.shareImageUrl} alt="分享图预览" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => onChange({ shareImageUrl: '' })}
                      className="bg-background/90 hover:bg-background absolute top-2 right-2 rounded p-1 shadow-sm"
                      aria-label="移除图片"
                    >
                      <Trash2 className="text-muted-foreground size-3.5" />
                    </button>
                  </>
                ) : (
                  <div className="text-muted-foreground flex flex-col items-center gap-1.5">
                    <ImagePlus className="size-6" />
                    <span className="text-xs">尚未设置分享图</span>
                    <Badge variant="secondary" className="text-[10px] font-normal">
                      500 × 200
                    </Badge>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Input
                  value={value.shareImageUrl.startsWith('data:') ? '' : value.shareImageUrl}
                  onChange={(e) => onChange({ shareImageUrl: e.target.value })}
                  placeholder="粘贴图片地址，或点击右侧示例"
                  className="h-8 text-[12px]"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 shrink-0 text-[12px]"
                  onClick={() => onChange({ shareImageUrl: DEMO_SHARE_IMAGE })}
                >
                  示例图
                </Button>
              </div>
            </div>
          </Field>

          <div className="space-y-4">
            <Field label="分享标题" required hint="好友看到的第一句话，建议 ≤18 字并带利益点">
              <Input
                value={value.shareTitle}
                onChange={(e) => onChange({ shareTitle: e.target.value })}
                placeholder="如：签到就抽 50 元京东卡"
                maxLength={40}
              />
            </Field>
            <Field label="分享预览" hint="下方为小程序分享卡片的大致效果">
              <div className="bg-muted/40 flex items-center gap-3 rounded-lg border p-2">
                <div className="bg-muted flex size-12 items-center justify-center overflow-hidden rounded">
                  {value.shareImageUrl ? (
                    <img src={value.shareImageUrl} alt="分享缩略图" className="h-full w-full object-cover" />
                  ) : (
                    <ImagePlus className="text-muted-foreground size-4" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-[13px] font-medium">{value.shareTitle || '未填写分享标题'}</div>
                  <div className="text-muted-foreground mt-0.5 truncate text-[11px]">{value.name || '未命名活动'}</div>
                </div>
              </div>
            </Field>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
