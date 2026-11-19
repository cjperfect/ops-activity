package com.activity.common.web.auth;

import com.activity.common.auth.UserTokenInfo;
import com.activity.common.enums.ResultCode;
import com.activity.common.exception.BizException;
import com.activity.common.web.annotation.UserToken;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

/** 临时模拟登录：固定 Token 映射固定用户。正式接入登录后替换该解析器。 */
public class UserTokenArgumentResolver implements HandlerMethodArgumentResolver {

    public static final String MOCK_TOKEN = "dev-admin-token";
    private static final UserTokenInfo MOCK_USER = new UserTokenInfo(1L, "admin", "开发管理员");

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.hasParameterAnnotation(UserToken.class);
    }

    @Override
    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer container,
                                  NativeWebRequest request, WebDataBinderFactory binderFactory) {
        if (parameter.getParameterType() != UserTokenInfo.class) {
            throw new IllegalArgumentException("@UserToken 参数必须使用 UserTokenInfo 类型");
        }
        String authorization = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authorization == null) {
            throw BizException.of(ResultCode.UNAUTHORIZED);
        }
        String[] parts = authorization.trim().split("\\s+", 2);
        if (parts.length != 2 || !"Bearer".equalsIgnoreCase(parts[0]) || !MOCK_TOKEN.equals(parts[1])) {
            throw BizException.of(ResultCode.UNAUTHORIZED);
        }
        return MOCK_USER;
    }
}
