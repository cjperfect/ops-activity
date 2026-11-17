package com.activity.common.result;

import com.activity.common.enums.ResultCode;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;

/**
 * 统一接口返回体。
 *
 * <p>所有 HTTP 接口都返回这个结构，HTTP 状态码恒为 200，真正的结果由 {@code code} 表达，
 * 好处是前端只需一套拦截逻辑：code === 0 取 data，否则统一弹 message。</p>
 *
 * <pre>
 * {
 *   "code": 0,
 *   "message": "操作成功",
 *   "data": { ... }
 * }
 * </pre>
 *
 * @param <T> 业务数据类型
 */
@Data
@NoArgsConstructor
public class Result<T> implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 业务状态码，0 表示成功，见 {@link ResultCode}
     */
    private int code;

    /**
     * 提示文案，失败时前端可直接展示
     */
    private String message;

    /**
     * 业务数据，失败时为 null
     */
    private T data;

    public Result(int code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    /* ---------------- 成功 ---------------- */

    /**
     * 成功且无数据，例如删除、下线等操作
     */
    public static <T> Result<T> ok() {
        return ok(null);
    }

    /**
     * 成功并携带数据
     */
    public static <T> Result<T> ok(T data) {
        return new Result<>(ResultCode.SUCCESS.getCode(), ResultCode.SUCCESS.getMessage(), data);
    }

    /* ---------------- 失败 ---------------- */

    /**
     * 失败，使用通用参数错误码
     */
    public static <T> Result<T> fail(String message) {
        return fail(ResultCode.BAD_REQUEST.getCode(), message);
    }

    /**
     * 失败，自定义业务码与文案
     */
    public static <T> Result<T> fail(int code, String message) {
        return new Result<>(code, message, null);
    }

    /**
     * 失败，使用预置错误码的默认文案
     */
    public static <T> Result<T> fail(ResultCode resultCode) {
        return fail(resultCode.getCode(), resultCode.getMessage());
    }
}
