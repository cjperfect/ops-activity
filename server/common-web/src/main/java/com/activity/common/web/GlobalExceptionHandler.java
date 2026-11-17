package com.activity.common.web;

import com.activity.common.enums.ResultCode;
import com.activity.common.exception.BizException;
import com.activity.common.result.Result;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.List;

/**
 * 全局异常处理：把各类异常统一收敛成 {@link Result}，保证前端只处理一种结构。
 *
 * <p>约定 HTTP 状态码恒为 200，业务成败看 body 里的 {@code code}；这样前端拦截器不会被
 * 4xx/5xx 打断，网关和 CORS 也不用为非 200 做额外处理。</p>
 *
 * <p>日志策略：业务异常（可预期）warn 一行、不打堆栈；其余异常 error + 堆栈，便于排查。</p>
 *
 * <p>本类由 {@code CommonWebAutoConfiguration} 注册为 bean，业务侧只要依赖 common-web 即生效；
 * 若业务需要自定义，在扫描包内声明自己的 {@code GlobalExceptionHandler} 即可覆盖。</p>
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * 业务异常：直接透传预置码与文案，不打印堆栈。
     *
     * <p>业务异常是「预期内的失败」，例如活动不存在、编码重复，打堆栈只会淹没真正的故障日志。</p>
     */
    @ExceptionHandler(BizException.class)
    public Result<Void> handleBizException(BizException ex, HttpServletRequest request) {
        log.warn("[业务异常] {} {} -> code={}, message={}", request.getMethod(), request.getRequestURI(), ex.getCode(), ex.getMessage());
        return ex.toResult();
    }

    /**
     * @RequestBody 参数校验失败（@Valid 校验 Entity/DTO 时触发）。
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Result<Void> handleMethodArgumentNotValid(MethodArgumentNotValidException ex, HttpServletRequest request) {
        String detail = buildFieldErrors(ex.getBindingResult().getFieldErrors());
        log.warn("[参数校验失败] {} {} -> {}", request.getMethod(), request.getRequestURI(), detail);
        return Result.fail(ResultCode.BAD_REQUEST.getCode(), detail);
    }

    /**
     * 表单、Query 参数绑定校验失败（@ModelAttribute / 非 JSON 请求体时触发）。
     */
    @ExceptionHandler(BindException.class)
    public Result<Void> handleBindException(BindException ex, HttpServletRequest request) {
        String detail = buildFieldErrors(ex.getBindingResult().getFieldErrors());
        log.warn("[参数绑定失败] {} {} -> {}", request.getMethod(), request.getRequestURI(), detail);
        return Result.fail(ResultCode.BAD_REQUEST.getCode(), detail);
    }

    /**
     * 缺少必填的 Query 参数，例如 /detail?id= 少传 id。
     */
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public Result<Void> handleMissingParameter(MissingServletRequestParameterException ex) {
        return Result.fail(ResultCode.BAD_REQUEST.getCode(), "缺少必填参数：" + ex.getParameterName());
    }

    /**
     * 参数类型不匹配，例如 id 传了非数字。
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public Result<Void> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        return Result.fail(ResultCode.BAD_REQUEST.getCode(), "参数 " + ex.getName() + " 类型不正确");
    }

    /**
     * 请求体不是合法 JSON，或字段类型无法反序列化。
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public Result<Void> handleMessageNotReadable(HttpMessageNotReadableException ex) {
        return Result.fail(ResultCode.BAD_REQUEST.getCode(), "请求体格式不正确");
    }

    /**
     * 请求方法不支持，例如用 GET 调用只允许 POST 的接口。
     */
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public Result<Void> handleMethodNotSupported(HttpRequestMethodNotSupportedException ex) {
        return Result.fail(ResultCode.METHOD_NOT_ALLOWED.getCode(), "不支持的请求方法：" + ex.getMethod());
    }

    /**
     * 路径不存在（Spring 6.1+ 对未匹配的静态/资源请求抛该异常，替代原来的 404 输出）。
     */
    @ExceptionHandler(NoResourceFoundException.class)
    public Result<Void> handleNoResourceFound(NoResourceFoundException ex) {
        return Result.fail(ResultCode.NOT_FOUND);
    }

    /**
     * 兜底：未预料的异常。记录完整堆栈，但只把通用文案返回给前端，避免泄露内部实现细节。
     */
    @ExceptionHandler(Exception.class)
    public Result<Void> handleException(Exception ex, HttpServletRequest request) {
        log.error("[系统异常] {} {}", request.getMethod(), request.getRequestURI(), ex);
        return Result.fail(ResultCode.INTERNAL_ERROR);
    }

    /**
     * 把字段校验错误拼成「字段: 提示; 字段: 提示」，前端可直接整条展示。
     */
    private String buildFieldErrors(List<FieldError> fieldErrors) {
        if (fieldErrors == null || fieldErrors.isEmpty()) {
            return ResultCode.BAD_REQUEST.getMessage();
        }
        StringBuilder sb = new StringBuilder();
        for (FieldError error : fieldErrors) {
            if (!sb.isEmpty()) {
                sb.append("; ");
            }
            sb.append(error.getField()).append(": ").append(error.getDefaultMessage());
        }
        return sb.toString();
    }
}
