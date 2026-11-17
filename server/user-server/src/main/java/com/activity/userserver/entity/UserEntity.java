package com.activity.userserver.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 用户实体，对应 sys_user 表。
 *
 */
@Data
@TableName("sys_user")
public class UserEntity implements Serializable {

    /**
     * 主键（雪花 ID）
     */
    @TableId(type = IdType.ASSIGN_ID)
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
    @TableField(property = "avatar_url")
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
    @TableField(property = "register_source")
    private Integer registerSource;

    /**
     * 最近登录时间
     */
    @TableField(property = "last_login_time")
    private LocalDateTime lastLoginTime;

    /**
     * 创建时间，由数据库默认值维护
     */
    @TableField(property = "create_time", fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    /**
     * 更新时间，由数据库自动更新
     */
    @TableField(property = "update_time", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    /**
     * 逻辑删除：0 未删 1 已删
     */
    @TableLogic
    private Integer deleted;
}
