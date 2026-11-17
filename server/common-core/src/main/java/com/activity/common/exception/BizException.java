package com.activity.common.exception;

import com.activity.common.enums.ResultCode;
import com.activity.common.result.Result;
import lombok.Getter;

import java.io.Serial;

/**
 * 业务异常：用于表达「可预期的失败」，例如活动不存在、编码重复、概率合计不等于 100%。
 *
 * <p>它只承载「业务码 + 提示文案」两件事，不依赖 Spring，因此放在 common-core 也不会
 * 给调用方带来任何容器/装配负担。抛出后由业务侧的 {@code GlobalExceptionHandler}
 * 转成 {@link Result}，见 {@link #toResult()}。</p>
 *
 * <p>使用约定：</p>
 * <ul>
 *   <li>可预期失败 → 抛 {@code BizException}，日志按 warn 记录，不打堆栈；</li>
 *   <li>不可预期失败（空指针、SQL 异常等）→ 直接抛出，由兜底 handler 打 error + 堆栈。</li>
 * </ul>
 */
@Getter
public class BizException extends RuntimeException {

    @Serial
    private static final long serialVersionUID = 1L;

    /** 业务状态码，取值见 {@link ResultCode} */
    private final int code;

    public BizException(int code, String message) {
        super(message);
        this.code = code;
    }

    /** 使用错误码自带的默认文案 */
    public BizException(ResultCode resultCode) {
        this(resultCode.getCode(), resultCode.getMessage());
    }

    /** 使用错误码，但把文案换成更具体的说明（会覆盖默认文案） */
    public BizException(ResultCode resultCode, String message) {
        this(resultCode.getCode(), message);
    }

    /* ---------------- 静态工厂：语义更清晰，也省去 new ---------------- */

    /** 通用参数错误（400） */
    public static BizException of(String message) {
        return new BizException(ResultCode.BAD_REQUEST.getCode(), message);
    }

    /** 使用预置错误码的默认文案 */
    public static BizException of(ResultCode resultCode) {
        return new BizException(resultCode);
    }

    /** 使用预置错误码，并补充具体细节，例如「活动编码 BREO_202611 已存在」 */
    public static BizException of(ResultCode resultCode, String message) {
        return new BizException(resultCode, message);
    }

    /** 自定义业务码，用于 ResultCode 里还没登记的场景 */
    public static BizException of(int code, String message) {
        return new BizException(code, message);
    }

    /**
     * 不经过全局异常处理器时，可直接把异常转成统一返回体，例如在拦截器、MQ 消费、定时任务里。
     */
    public <T> Result<T> toResult() {
        return Result.fail(this.code, getMessage());
    }
}
