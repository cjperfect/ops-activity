import { cn } from '@/lib/utils'

interface FieldProps {
  label: string
  required?: boolean
  hint?: React.ReactNode
  className?: string
  children: React.ReactNode
}

/** 统一的表单项容器：标签 + 必填星号 + 说明文案，避免每个表单重复写间距 */
export function Field({ label, required, hint, className, children }: FieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex items-center gap-1">
        <label className="text-[13px] font-medium">{label}</label>
        {required && <span className="text-destructive text-xs">*</span>}
      </div>
      {children}
      {hint && <div className="text-muted-foreground text-xs leading-relaxed">{hint}</div>}
    </div>
  )
}
