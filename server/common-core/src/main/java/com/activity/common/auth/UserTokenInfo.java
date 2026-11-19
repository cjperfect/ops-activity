package com.activity.common.auth;

/** 当前请求的用户身份，与数据库用户实体无关。 */
public record UserTokenInfo(Long userId, String username, String nickname) {
}
