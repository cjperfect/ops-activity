package com.activity.userapi.dto;

import java.time.LocalDateTime;

/**
 * 用户资料传输对象。
 *
 * <p>放在 api 模块里，调用方（app-manage）与服务方（user-server）共用同一份定义，
 * 避免两边各写一份 DTO 导致字段漂移。</p>
 */
public class UserDTO {

    /**
     * 主键（雪花 ID）
     */
    private Long id;

    /**
     * 微信小程序 openid
     */
    private String openid;

    /**
     * 微信 unionid
     */
    private String unionid;

    /**
     * 手机号
     */
    private String phone;

    /**
     * 昵称
     */
    private String nickname;

    /**
     * 头像地址
     */

    private String avatarUrl;

    /**
     * 性别：0 未知 1 男 2 女
     */
    private Integer gender;

    /**
     * 状态：1 正常 0 禁用 -1 已注销
     */
    private Integer status;

    /**
     * 注册来源：1 小程序 2 公众号 3 H5
     */
    private Integer registerSource;

    /**
     * 最近登录时间
     */
    private LocalDateTime lastLoginTime;

    /**
     * 创建时间，由数据库默认值维护
     */
    private LocalDateTime createTime;

    /**
     * 更新时间，由数据库自动更新
     */
    private LocalDateTime updateTime;
}