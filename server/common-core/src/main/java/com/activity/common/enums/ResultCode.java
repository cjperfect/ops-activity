package com.activity.common.enums;

/**
 * 统一业务状态码。
 *
 * <p>约定：0 表示成功；4xx/5xx 段沿用 HTTP 语义，方便前端按码做统一处理；
 * 业务码从 10000 起按模块分段，避免与通用错误码冲突。</p>
 */
public enum ResultCode {

    /* ---------------- 通用成功 ---------------- */
    SUCCESS(0, "操作成功"),

    /* ---------------- 通用客户端错误 ---------------- */
    BAD_REQUEST(400, "请求参数不合法"),
    UNAUTHORIZED(401, "未登录或登录已过期"),
    FORBIDDEN(403, "没有操作权限"),
    NOT_FOUND(404, "请求的资源不存在"),
    METHOD_NOT_ALLOWED(405, "请求方法不支持"),
    CONFLICT(409, "数据状态冲突，请刷新后重试"),
    TOO_MANY_REQUESTS(429, "操作过于频繁，请稍后再试"),

    /* ---------------- 通用服务端错误 ---------------- */
    INTERNAL_ERROR(500, "系统繁忙，请稍后重试"),
    SERVICE_UNAVAILABLE(503, "服务暂不可用"),

    /* ---------------- 活动业务码 1xxxx ---------------- */
    ACTIVITY_NOT_FOUND(10001, "活动不存在"),
    ACTIVITY_CODE_DUPLICATED(10002, "活动编码已存在"),
    ACTIVITY_STATUS_NOT_ALLOWED(10003, "当前活动状态不允许该操作"),
    ACTIVITY_TIME_INVALID(10004, "活动结束时间必须晚于开始时间"),

    /* ---------------- 奖品业务码 2xxxx ---------------- */
    PRIZE_NOT_FOUND(20001, "奖品不存在"),
    PRIZE_PROBABILITY_INVALID(20002, "抽奖概率合计必须为 100%"),
    PRIZE_STOCK_NOT_ENOUGH(20003, "奖品库存不足"),
    PRIZE_TYPE_UNSUPPORTED(20004, "不支持的奖品类型");

    /** 业务码：0 成功，其余均为失败 */
    private final int code;

    /** 默认提示文案，可直接展示给用户 */
    private final String message;

    ResultCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}
